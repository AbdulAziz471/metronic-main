import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  UntypedFormArray,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { Observable } from 'rxjs';
import moment from 'moment';
import { Config } from 'datatables.net';
import {
  UserQueryParams,
  UserClaim,
  Action,
  Page,
  PageAction,
} from './users.modal';
import { RolesApiService } from 'src/app/Service/RolesApi.service';
import { EditRoleService } from 'src/app/Service/EditRole.Service';
import { UserService } from 'src/app/Service/UserAPi.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppPageApiService } from 'src/app/Service/AppPageApi.service';
import { AppActionService } from 'src/app/Service/AppActionsApi.service';
import { forkJoin } from 'rxjs';
import { Role, User, } from './users.modal';
@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
})
export class UserListingComponent implements OnInit, AfterViewInit, OnDestroy {
  roleList: Role[];
  selectedRoles: number[] = [];
  form: FormGroup;
  pagesList: any[] = [];
  roles: any[] = [];
  actionList: any[] = [];
  pageActions: any[] = [];
  user: { id: string; userClaims: UserClaim[] } = { id: '', userClaims: [] };
  isMenuOpen: boolean = false;
  selectedUserId: number | null = null;
  password: string = ''; // New password
  confirmPassword: string = '';
  private modalRef: any;
  selectedEmailTemapletSettingID: number | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isCollapsed1 = false;
  isCollapsed2 = true;
  datatableConfig: Config = {};
  public users: any[] = [];
  selectedUser: any = {};
  
 

  onIsActiveChange() {
    console.log('isActive Changed:', this.form.value.isActive);
  }
  selectedAction: any = {
    Fields: '',
    OrderBy: '',
    PageSize: 10,
    isActive: true,
    Skip: 0,
    SearchQuery: '',
    email: '',
  };
  reloadEvent: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('permissionModal') permissionModal: any;
  @ViewChild('passwordModal') passwordModal: any;
  @ViewChild('deleteSwal') deleteSwal: any; // Reference to the confirmation Swal
  @ViewChild('successSwal') successSwal: any; // Reference to the success Swal
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any; // Reference to modal
  swalOptions: SweetAlertOptions = {};
  constructor(
    private fb: FormBuilder,
    private roleServices: RolesApiService,
    private userService: UserService,
    private editroleservice: EditRoleService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      userAllowedIPs: this.fb.array([]),
    });

 
  }
  initializeForm(user?: User): void {
    this.form = this.fb.group({
      id: [user?.id || ''],
      firstName: [user?.firstName || '', Validators.required],
      lastName: [user?.lastName || '', Validators.required],
      phoneNumber: [user?.phoneNumber || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      userName: [user?.userName || ''],
      password: [''],  // Generally not filled for security
      isActive: [user?.isActive ?? false],
      address: [user?.address || '', Validators.required],
      userAllowedIPs: this.fb.array(user?.userAllowedIPs ? user.userAllowedIPs.map(ip => this.createIPFormGroup(ip)) : [])
    });

    console.log("User for form:", user);

    const ipsArray = this.form.get('userAllowedIPs') as UntypedFormArray;
    if (user?.userAllowedIPs) {
        user.userAllowedIPs.forEach(ip => {
            ipsArray.push(this.fb.group({
                userId: [ip.userId],
                ipAddress: [ip.ipAddress]
            }));
        });
        console.log("IPs added to form:", ipsArray.value);
    } else {
        console.log("No IPs to add.");
    }

    const emailControl = this.form.get('email');
    if (emailControl) {
        emailControl.valueChanges.subscribe(value => {
            this.form.get('userName')?.setValue(value, { emitEvent: false });
        });
    } else {
        console.error('Email control is missing in the form group');
    }
}
createIPFormGroup(ip: any): FormGroup {
  return this.fb.group({
      userId: [ip.userId],
      ipAddress: [ip.ipAddress, Validators.required]  // ensure validation if needed
  });
}
  openFormModal(
    content: any,
    action: 'create' | 'edit',
    user?: User
): void {
    this.isEditMode = action === 'edit' && !!user;

    console.log("Open Form Modal - Mode:", action, "User:", user);

    if (this.isEditMode) {
        // Initialize form with the user data for editing
        this.initializeForm(user);
        console.log("Initializing form for edit:", user);
    } else {
        // For creating a new user, reset the form to default values
        this.initializeForm(); // Initialize with no user to set default/empty values
        console.log("Initializing form for new user creation.");
    }

    this.fetchRoles(); // Fetch roles whenever the modal is opened
    this.modalRef = this.modalService.open(content); // Open the modal with the prepared content
}


  
  createUsers(): void {
    this.userService.createUser(this.form.value).subscribe(
      (response) => {
        this.isLoading = false;
        Swal.fire('Success', 'User created successfully!', 'success'); // Success message
        this.loadUsers();
        this.formModal.dismiss();
      },
      (error) => {
        this.isLoading = false;
        console.error('Error creating User:', error);
        Swal.fire('Error', 'There was a problem creating the User.', 'error');
      }
    );
  }
  get userAllowedIPs(): UntypedFormArray {
    return this.form.get('userAllowedIPs') as UntypedFormArray;
  }

  newIP(): UntypedFormGroup {
    return this.fb.group({
      userId: [''], // This could be a hidden input if needed, or removed if not used
      ipAddress: [''],
    });
  }

  addIP(): void {
    this.userAllowedIPs.push(this.newIP());
  }
  removeIP(i: number): void {
    this.userAllowedIPs.removeAt(i);
  }
  onSubmit(): void {
    if (this.form.valid) {
        const formValue = this.form.value;
        if (this.isEditMode && this.selectedUser) {
            this.userService.updateUser(formValue.id, formValue).subscribe({
                next: response => {
                    Swal.fire('Success', 'User updated successfully!', 'success');
                    this.loadUsers();
                    this.modalRef.close();
                },
                error: error => {
                    console.error('Error updating User:', error);
                    Swal.fire('Error', 'There was a problem updating the User.', 'error');
                }
            });
        } else {
            this.userService.createUser(formValue).subscribe({
                next: response => {
                    Swal.fire('Success', 'User created successfully!', 'success');
                    this.loadUsers();
                    this.modalRef.close();
                },
                error: error => {
                    console.error('Error creating User:', error);
                    Swal.fire('Error', 'There was a problem creating the User.', 'error');
                }
            });
        }
    } else {
        console.log('Form is not valid:', this.form.value);
    }
}

openModal(content: any): void {
  this.fetchRoles();
  this.modalService.open(content);
}
  toggleMenu(event: Event, userId: number): void {
    event.stopPropagation();
    if (this.selectedUserId === userId) {
      this.selectedUserId = null;
    } else {
      this.selectedUserId = userId;
    }
  }

  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.loadUsers();
    this.initializeForm();
  }

  loadUsers(): void {
    console.log(
      'Calling loadUsers with isActive:',
      this.selectedAction.isActive
    );
    this.userService.getAllUsers(this.selectedAction).subscribe({
      next: (response) => {
        console.log('Received users:', response);
        this.users = response;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error fetching users', error),
    });
  }
  get inputs() {
    return this.form.get('inputs') as FormArray;
  }
  fetchRoles(): void {
    this.roleServices.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
      },
    });
  }
  onRolesChange(): void {
    // Update the selectedRoles based on the selected IDs in the form
    this.selectedRoles = this.form.value
      .get('roles')
      .value.map((roleId: string) =>
        this.roles.find((role) => role.id === roleId)
      );
  }

  addInput(): void {
    this.inputs.push(this.fb.control(''));
  }
  onpassowrdSubmit(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  }
  onpasswordSubmit(): void {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const payload = {
      username: this.selectedUser.email,
      password: this.password,
    };

    this.isLoading = true;
    this.userService.chnagePassword(payload).subscribe(
      (response) => {
        this.isLoading = false;
        alert('Password changed successfully!');
        // Close the modal, refresh the user list, etc.
      },
      (error) => {
        this.isLoading = false;
        console.error('Error changing password:', error);
        alert('Failed to change password.');
      }
    );
  }
  deleteInput(index: number): void {
    this.inputs.removeAt(index);
  }
 
  callApis(): Observable<any> {
    return forkJoin({
      requestOne: this.editroleservice.getAllPages(),
      requestTwo: this.editroleservice.getAllActions(),
      requestThree: this.editroleservice.getAllPagesActions(),
    });
  }
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }


  updateEmailTemplateSetting(id: number, config: UserQueryParams): void {
    this.isLoading = true;
    this.roleServices.updateRole(id, config).subscribe(
      (response) => {
        this.isLoading = false;
        this.formModal.close();
        Swal.fire('Success', 'SMTP setting updated successfully!', 'success');
        // this.loadUser();
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating SMTP setting:', error);
      }
    );
  }
  deleteEmailTemplateSetting(id: number): void {
    if (confirm('Are you sure you want to delete this SMTP setting?')) {
      this.roleServices.deleteRole(id).subscribe(
        (response) => {
          console.log('User deleted:', response);
          // After deletion, reload the SMTP settings
          // this.loadUser();
        },
        (error) => {
          console.error('Error deleting User setting:', error);
        }
      );
    }
  }

  openDeleteSwal(id: number): void {
    if (id !== null) {
      this.selectedEmailTemapletSettingID = id;
      this.deleteSwal.fire();
    } else {
      console.error('Error: Invalid SMTP setting ID');
    }
  }
  triggerDelete(id: number | null): void {
    if (id !== null) {
      // Check if the ID is not null
      this.userService.deleteUser(id).subscribe(
        (response) => {
          console.log('User deleted:', response);
          this.successSwal.fire();
          this.loadUsers();
        },
        (error) => {
          console.error('Error deleting User:', error);
        }
      );
    } else {
      console.error('Error: Invalid User ID');
    }
  }

  
  extractText(obj: any): string {
    var textArray: string[] = [];

    for (var key in obj) {
      if (typeof obj[key] === 'string') {
        // If the value is a string, add it to the 'textArray'
        textArray.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        // If the value is an object, recursively call the function and concatenate the results
        textArray = textArray.concat(this.extractText(obj[key]));
      }
    }

    // Use a Set to remove duplicates and convert back to an array
    var uniqueTextArray = Array.from(new Set(textArray));

    // Convert the uniqueTextArray to a single string with line breaks
    var text = uniqueTextArray.join('\n');

    return text;
  }
  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign(
      {
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-' + style,
        },
      },
      swalOptions
    );
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }
  ngOnDestroy(): void {
    this.reloadEvent.unsubscribe();
  }

  openPasswordModal(content: any, user: any) {
    this.selectedUser = { ...user };
    this.modalService.open(content);
  }
  public pages: any[] = [];
  openPermissionModal(content: any, user: any): void {
    this.selectedUser = { ...user }; // Bind the selected user

    
    this.callApis().subscribe({
      next: (results) => {
        console.log('All requests successful', results);

        this.pagesList = results.requestOne; // Assign pages list
        this.actionList = results.requestTwo; // Assign actions list
        this.pageActions = results.requestThree; // Assign page-actions mappings

        // Now open the modal after data is loaded
        this.modalService.open(content, { size: 'lg' });
      },
      error: (error) => {
        console.error('Error fetching API data', error);
      },
    });
  }

  checkPageAction(pageId: string, actionId: string): boolean {
    const pageAction = this.pageActions.find(
      (c) => c.pageId === pageId && c.actionId === actionId
    );

    return !!pageAction; // Return true if found, false otherwise
  }

  checkPermission(pageId: string, actionId: string): boolean {
    const userClaim = this.user.userClaims.find(
      (c) => c.pageId === pageId && c.actionId === actionId
    );

    return !!userClaim; // Return true if found, false otherwise
  }

 // Handle permission change when the toggle is switched
onPermissionChange(event: MatSlideToggleChange, page: Page, action: Action): void {
  const isChecked = event.checked;
  if (isChecked) {
    const newClaim = {
      userId: this.selectedUser.id, // Make sure selectedUser is always the target user
      claimType: `${page.name}_${action.name}`,
      claimValue: 'true',
      pageId: page.id || 'default-page-id',
      actionId: action.id || 'default-action-id'
    };
    this.user.userClaims.push(newClaim);
    console.log('Added new claim:', newClaim);
  } else {
    const index = this.user.userClaims.findIndex(c => c.actionId === action.id && c.pageId === page.id);
    if (index > -1) {
      const removedClaim = this.user.userClaims.splice(index, 1)[0];
      console.log('Removed claim:', removedClaim);
    } else {
      console.warn('No claim found to remove for:', page.name, action.name);
    }
  }
}

// Function to save user claims
saveUserClaims(): void {
  if (!this.selectedUser || !this.selectedUser.id) {
    console.error('No user selected or user ID missing.');
    return;
  }

  const updatedClaims = this.user.userClaims.map(claim => {
    const page = this.pagesList.find(p => p.id === claim.pageId);
    const action = this.actionList.find(a => a.id === claim.actionId);

    if (!page || !action) {
      console.error('Page or Action not found', { pageId: claim.pageId, actionId: claim.actionId });
      return null;
    }

    return {
      userId: this.selectedUser.id,
      claimType: `${page.name}_${action.name}`,
      claimValue: claim.claimValue,
      pageId: claim.pageId,
      actionId: claim.actionId
    };
  }).filter(claim => claim !== null);

  if (updatedClaims.length > 0) {
    this.userService.updateUserClaims(this.selectedUser.id, updatedClaims).subscribe({
      next: response => console.log('Claims updated successfully', response),
      error: err => console.error('Error updating claims', err)
    });
  } else {
    console.error('No valid claims to update');
  }
}

  
}
