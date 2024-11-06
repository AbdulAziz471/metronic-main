import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  UntypedFormArray,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { Observable } from 'rxjs';

import {
  UserQueryParams,
  UserClaim,
  Action,
  Page,
  PageAction,
  UserRoles,
} from './users.modal';
import { RolesApiService } from 'src/app/Service/RolesApi.service';
import { EditRoleService } from 'src/app/Service/EditRole.Service';
import { UserService } from 'src/app/Service/UserAPi.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppPageApiService } from 'src/app/Service/AppPageApi.service';
import { AppActionService } from 'src/app/Service/AppActionsApi.service';
import { forkJoin } from 'rxjs';
import { Role, User } from './users.modal';
import { MatOptionSelectionChange } from '@angular/material/core';
import { AuthApiService } from 'src/app/Service/AuthApi.service';
@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserListingComponent implements OnInit, AfterViewInit, OnDestroy {
  roles: Role[] = [];
  usersRoles: UserRoles[] = [];
  selectedRoles: number[] = [];
  form: FormGroup;
  pagesList: any[] = [];
  actionList: any[] = [];
  roleUsers = [];
  otherUsers = [];
  selectedRoleId: string;
  pageActions: any[] = [];
  user: { id: string; userClaims: UserClaim[] } = { id: '', userClaims: [] };
  isMenuOpen: boolean = false;
  selectedUserId: number | null = null;
  password: string = ''; 
  confirmPassword: string = '';
  private modalRef: any;
  selectedEmailTemplateSettingId: number | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isCollapsed1 = false;
  isCollapsed2 = true;
  public users: any[] = [];
  selectedUser: any = {};
  constructor(
    private authService: AuthApiService,
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
  @ViewChild('usersModal') usersModal: any;
  @ViewChild('permissionModal') permissionModal: any;
  @ViewChild('userRolesModal') userRolesModal: any;
  @ViewChild('passwordModal') passwordModal: any;
  @ViewChild('successSwal') successSwal: any; 
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any; 
  swalOptions: SweetAlertOptions = {};
 
  initializeForm(user?: User): void {
    this.form = this.fb.group({
      id: [user?.id || ''],
      firstName: [user?.firstName || '', Validators.required],
      lastName: [user?.lastName || '', Validators.required],
      phoneNumber: [user?.phoneNumber || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      userName: [user?.userName || ''],
      password: [''],
      address: [user?.address || '', Validators.required],
      isActive: [user?.isActive ?? false],
      userRoles: [user?.userRoles?.map(role => role.roleId) || []],  // Just use a
      userAllowedIPs: this.fb.array(
        user?.userAllowedIPs
          ? user.userAllowedIPs.map((ip) => this.createIPFormGroup(ip))
          : []
      ),
    });

    const emailControl = this.form.get('email');
    if (emailControl) {
      emailControl.valueChanges.subscribe((value) => {
        this.form.get('userName')?.setValue(value, { emitEvent: false });
      });
    } else {
      console.error('Email control is missing in the form group');
    }
  }
  createIPFormGroup(ip: any): FormGroup {
    return this.fb.group({
      userId: [ip.userId],
      ipAddress: [ip.ipAddress, Validators.required], 
    });
  }
 
  toggleRoleSelection(event: MatOptionSelectionChange, roleId: string): void {
    const rolesArray = this.form.get('userRoles') as FormArray;
    if (event.isUserInput) {
      if (event.source.selected) {
        rolesArray.push(this.fb.control(roleId));
      } else {
        const index = rolesArray.controls.findIndex(control => control.value === roleId);
        if (index !== -1) {
          rolesArray.removeAt(index);
        }
      }
    }
  }
  
  hasPermission(permission: string): boolean {
    return this.authService.hasClaim(permission);
  }

  
  get userRolesControls() {
    return this.form.get('userRoles') as FormArray;
  }
  
  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
      formValue.userRoles = formValue.userRoles.map((roleId: string) => ({
        userId: formValue.id, 
        roleId: roleId
      }));
  
        this.cdr.detectChanges();  
  
        if (this.isEditMode) {
          this.userService.updateUser(formValue.id, formValue).subscribe({
            next: (response) => {
            
              Swal.fire('Success', 'User updated successfully!', 'success');
              this.checkPermissionAndLoadUsers();
              this.modalRef.close();
            },
            error: (error) => {
                console.error('Error updating User:', error);
                Swal.fire('Error', 'There was a problem updating the User.', 'error');
            },
          });
        } else {
            this.userService.createUser(formValue).subscribe({
              next: (response) => {
               
                Swal.fire('Success', 'User created successfully!', 'success');
                this.checkPermissionAndLoadUsers();
                this.modalRef.close();
              },
              error: (error) => {
                  console.error('Error creating User:', error);
                  Swal.fire('Error', 'There was a problem creating the User.', 'error');
              },
          });
        }
    } else {
        console.log('Form is not valid:', this.form.value);
    }
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
    this.initializeForm();
    this.checkPermissionAndLoadUsers();
  }
  checkPermissionAndLoadUsers(): void {
    if (this.authService.hasClaim('user_list')) {
      this.loadUsers();
    } else {
      console.log('No permission to list users');
    }
  }
  loadUsers(): void {
    this.userService.getUsers(this.selectedAction).subscribe({
      next: (response) => {
    
        this.users = response;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error fetching users', error),
    });
  }
  loadAllUsers(): void {
    this.userService.getAllUser().subscribe({
      next: (response) => {
        this.users = response;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error fetching users', error),
    });
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
  get inputs() {
    return this.form.get('inputs') as FormArray;
  }

  addInput(): void {
    this.inputs.push(this.fb.control(''));
  }

  onpasswordSubmit(): void {
    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
      return;
    }

    const payload = {
      username: this.selectedUser.email,
      password: this.password,
    };

    this.isLoading = true;
    this.userService.changePassword(payload).subscribe(
      (response) => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password changed successfully!',
        });
      },

      (error) => {
        this.isLoading = false;
        console.error('Error changing password:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Failed to change password.',
        });
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

  triggerDelete(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(
          response => {
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
            this.loadUsers(); // Reload users after deletion
          },
          error => {
            console.error('Error deleting user:', error);
            Swal.fire(
              'Failed!',
              'There was a problem deleting the user.',
              'error'
            );
          }
        );
      }
    });
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
 
  checkPageAction(pageId: string, actionId: string): boolean {
    const pageAction = this.pageActions.find(
      (c) => c.pageId === pageId && c.actionId === actionId
    );
  
    return !!pageAction; // Return true if found, false otherwise
  }
  
  checkPermission(pageId: string, actionId: string): boolean {
    return !!this.selectedUser.userClaims.find(
      (claim: UserClaim) =>
        claim.pageId === pageId &&
        claim.actionId === actionId &&
        claim.claimValue === 'true'
    );
  }
  
  onPermissionChange(event: MatSlideToggleChange, page: Page, action: Action): void {
    const isChecked = event.checked;
    const existingClaimIndex = this.selectedUser.userClaims.findIndex(
      (claim: UserClaim) => claim.pageId === page.id && claim.actionId === action.id
    );
  
    if (isChecked) {
      if (existingClaimIndex === -1) {
        // Add new claim if it doesn't exist
        const newClaim = {
          userId: this.selectedUser.id,
          claimType: `${page.name}_${action.name}`,
          claimValue: 'true',
          pageId: page.id || 'default-page-id',
          actionId: action.id || 'default-action-id',
        };
        this.selectedUser.userClaims.push(newClaim);
        console.log('Added new claim:', newClaim);
      } else {
        // Update existing claim value to 'true'
        this.selectedUser.userClaims[existingClaimIndex].claimValue = 'true';
        console.log('Updated existing claim to true:', this.selectedUser.userClaims[existingClaimIndex]);
      }
    }  else {
      if (existingClaimIndex > -1) {

        const removedClaim = this.selectedUser.userClaims.splice(existingClaimIndex, 1)[0];
        console.log('Removed claim:', removedClaim);
      } else {
        console.warn('No claim found to remove for:', page.name, action.name);
      }
    }
  }
  
  saveUserClaims(): void {
    if (!this.selectedUser || !this.selectedUser.id) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No user selected or user ID missing.',
      });
      return;
    }
  
    // Prepare updated claims
    const updatedClaims = this.selectedUser.userClaims.map((claim: UserClaim) => {
      const page = this.pagesList.find((p) => p.id === claim.pageId);
      const action = this.actionList.find((a) => a.id === claim.actionId);
  
      if (!page || !action) {
        console.error('Page or Action not found', {
          pageId: claim.pageId,
          actionId: claim.actionId,
        });
        return null;
      }
  
      return {
        userId: this.selectedUser.id,
        claimType: `${page.name}_${action.name}`,
        claimValue: claim.claimValue,
        pageId: claim.pageId,
        actionId: claim.actionId,
      };
    }).filter((claim: UserClaim) => claim !== null);
  
    if (updatedClaims.length > 0) {
      this.userService.updateUserClaims(this.selectedUser.id, updatedClaims).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Claims updated successfully!',
          });
          console.log('Claims updated successfully', response);
          this.modalRef.close();
        },
        error: (err) => {
          console.error('Error updating claims', err);
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Failed to update claims.',
          });
        },
      });
    } else {
      console.error('No valid claims to update');
      Swal.fire({
        icon: 'info',
        title: 'No Changes',
        text: 'No valid claims to update.',
      });
    }
  }
  
  updateRoleUsers() {
    this.userService.updateRoleUsers(this.selectedRoleId, this.roleUsers).subscribe(() => {
    });
  }


  openFormModal(content: any, action: 'create' | 'edit', user?: User): void {
    this.isEditMode = action === 'edit' && !!user;
  
    console.log('Open Form Modal - Mode:', action, 'User:', user);
  
    if (this.isEditMode && user) {
      console.log('Fetching user details for edit:', user.id);
      // Call the API to fetch user details
      this.userService.getUserbyId(user.id).subscribe({
        next: (fetchedUser) => {
          console.log('User details fetched:', fetchedUser);
          this.initializeForm(fetchedUser); // Initialize form with fetched user details
          this.modalRef = this.modalService.open(content);
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
          Swal.fire('Error', 'Could not load user details for editing.', 'error');
        }
      });
    } else {
      this.initializeForm(); // Initialize form for creating a new user
      console.log('Initializing form for new user creation.');
      this.modalRef = this.modalService.open(content);
    }
  
    this.fetchRoles(); // Ensure roles are fetched for role selection in the form
  } 
  openPasswordModal(content: any, user: any) {
    this.selectedUser = { ...user };
    this.modalService.open(content);
  }
  public pages: any[] = [];
  openPermissionModal(content: any, user: any): void {
    this.selectedUser = { ...user };
  
    this.userService.getUserbyId(user.id).subscribe({
      next: (completeUserDetails) => {
        this.selectedUser = completeUserDetails; // Update with fresh user data including claims
  
        this.callApis().subscribe({
          next: (results) => {
            this.pagesList = results.requestOne;
            this.actionList = results.requestTwo;
            this.pageActions = results.requestThree;
  
            // Open the modal after ensuring all necessary data is loaded
            this.modalService.open(content, { size: 'lg' });
          },
          error: (error) =>
            console.error('Error fetching pages/actions data', error),
        });
      },
      error: (error) => console.error('Error fetching user details:', error),
    });
  }
  openUsersRolesModal(content: any): void {
    this.fetchRoles();
    this.loadAllUsers();
    this.modalService.open(content, { size: 'lg',}); // Open the modal
   }
}















