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
import { FormArray, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { Observable } from 'rxjs';
import moment from 'moment';
import { Config } from 'datatables.net';
import { UserQueryParams, UserClaim, Action , Page,PageAction,  } from './users.modal';
import { RolesApiService } from 'src/app/Service/RolesApi.service';
import { EditRoleService } from 'src/app/Service/EditRole.Service';
import { UserService } from 'src/app/Service/UserAPi.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppPageApiService } from 'src/app/Service/AppPageApi.service';
import { AppActionService } from 'src/app/Service/AppActionsApi.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.scss'],
})
export class UserListingComponent implements OnInit, AfterViewInit, OnDestroy {
  pagesList: any[] = []; // List of pages
  actionList: any[] = []; // List of actions
  pageActions: any[] = []; // List of page-action mappings
  user: { id: string, userClaims: UserClaim[] } = { id: '', userClaims: [] };
  isMenuOpen: boolean = false;  
  selectedUserId: number | null = null; 
  public form: FormGroup;
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
  crateAction: any = {
    id: '4',
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    phoneNumber: '',
    isActive: false,
    address: '',
    userAllowedIPs: [],
    userRoles: [],
  };

  onIsActiveChange() {
    console.log('isActive Changed:', this.crateAction.isActive);
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
  toggleMenu(event: Event, userId: number): void {
    event.stopPropagation(); // Prevent event from bubbling up and closing the menu
    if (this.selectedUserId === userId) {
      // If the menu is already open for the selected user, close it
      this.selectedUserId = null;
    } else {
     
      this.selectedUserId = userId;
    }
  }

  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.loadUsers();
    console.log('PageActions:', this.pageActions);
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
  openFormModal(
    content: any,
    action: 'create' | 'edit',
    eTemplate?: UserQueryParams
  ): void {
    if (action === 'edit' && eTemplate) {
      this.isEditMode = true;
      this.selectedAction = { ...eTemplate };
    } else {
      this.isEditMode = false;
      this.callApis();
      this.selectedAction = {
        Fields: '',
        OrderBy: '',
        PageSize: 10,
        Skip: 0,
        SearchQuery: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        isActive: null,
      };
    }
    this.modalRef = this.modalService.open(content);
  }
  callApis(): Observable<any> {
    return forkJoin({
      requestOne: this.editroleservice.getAllPages(),
      requestTwo: this.editroleservice.getAllActions(),
      requestThree: this.editroleservice.getAllPagesActions()
    });
  }
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
  // checkPageAction(pageId: string, actionId: string): boolean {
  //   return this.pageActions.some(c => c.pageId === pageId && c.actionId === actionId);
  // }

  // checkPermission(pageId: string, actionId: string): boolean {
  //   return this.role.roleClaims.some(c => c.pageId === pageId && c.actionId === actionId);
  // }

  openModal(content: any): void {
    this.modalService.open(content);
  }
  createUsers(): void {
    this.userService.createUser(this.crateAction).subscribe(
      (response) => {
        this.isLoading = false;
        Swal.fire('Success', 'User created successfully!', 'success'); // Success message
        // this.loadUser(); // Reload the settings
        this.formModal.dismiss(''); // Close the modal
      },
      (error) => {
        this.isLoading = false;
        console.error('Error creating SMTP setting:', error);
        Swal.fire(
          'Error',
          'There was a problem creating the SMTP setting.',
          'error'
        ); // Error message
      }
    );

    // this.UserService(this.selectedAction).subscribe(
    //   (response) => {
    //     this.isLoading = false;
    //     Swal.fire('Success', 'SMTP setting created successfully!', 'success'); // Success message
    //     // this.loadUser(); // Reload the settings
    //     this.formModal.dismiss(""); // Close the modal
    //   },
    //   (error) => {
    //     this.isLoading = false;
    //     console.error('Error creating SMTP setting:', error);
    //     Swal.fire('Error', 'There was a problem creating the SMTP setting.', 'error'); // Error message
    //   }
    // );
    //   }
    // });
  }
  // Update existing SMTP setting
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
          this.successSwal.fire(); // Show the success Swal after deletion
          // this.loadUser();  // Reload SMTP settings after deletion
        },
        (error) => {
          console.error('Error deleting User:', error);
        }
      );
    } else {
      console.error('Error: Invalid User ID');
    }
  }
  // Handle form submission for create or update
  onSubmit(): void {
    if (this.form.valid) {
      this.createUsers();
      console.log('Submitting Form:', this.form.value);
      // Submit logic here
    } else {
      console.log('Form is not valid:', this.form.value);
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

  get userAllowedIPs(): FormArray {
    return this.form.get('userAllowedIPs') as FormArray;
  }

  addIPField(): void {
    this.userAllowedIPs.push(this.fb.control(''));
  }

  deleteIPField(index: number): void {
    this.userAllowedIPs.removeAt(index);
  }


  openPasswordModal(content: any, user: any) {
    this.selectedUser = { ...user };
    this.modalService.open(content);
  }
  public pages: any[] = [];
  openPermissionModal(content: any, user: any): void {
    this.selectedUser = { ...user }; // Bind the selected user
  
    // Fetch necessary data before opening the modal
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
      }
    });
  }
  
  checkPageAction(pageId: string, actionId: string): boolean {
    const pageAction = this.pageActions.find(c => c.pageId === pageId && c.actionId === actionId);
    console.log('Checking PageAction:', pageAction);
    return !!pageAction; // Return true if found, false otherwise
  }
  
  // Check if permission exists for a specific pageId and actionId
  checkPermission(pageId: string, actionId: string): boolean {
    const userClaim = this.user.userClaims.find(c => c.pageId === pageId && c.actionId === actionId);
    console.log('Checking Permission for PageId:', pageId, 'ActionId:', actionId, 'Permission:', userClaim);
    return !!userClaim; // Return true if found, false otherwise
  }
  
  // Handle permission change when the toggle is switched
  onPermissionChange(event: any, page: Page, action: Action): void {
    const isChecked = event.target.checked; // Get the toggle state (true/false)
  
    if (isChecked) {
      // Add the claim if permission is granted
      this.user.userClaims.push({
        userId: this.user.id,
        claimType: `${page.name}_${action.name}`,
        claimValue: 'true', // Adjust claim value as needed
        pageId: page.id || '',  // Provide a default value if page.id is undefined
        actionId: action.id || '',  // Provide a default value if action.id is undefined
      });
    } else {
      // Remove the claim if permission is revoked
      const roleClaimToRemove = this.user.userClaims.find(
        (c) => c.actionId === action.id && c.pageId === page.id
      );
      if (roleClaimToRemove) {
        const index = this.user.userClaims.indexOf(roleClaimToRemove);
        if (index > -1) {
          this.user.userClaims.splice(index, 1);
        }
      }
}
  }
}