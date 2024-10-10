import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2'; 
import { Config } from 'datatables.net';
import { Observable } from 'rxjs';
import {UserClaim, Page ,Action } from "./role.model"
import { Roles ,} from './role-listing.model';
import { EditRoleService } from 'src/app/Service/EditRole.Service';
import { RolesApiService } from 'src/app/Service/RolesApi.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-role-listing',
  templateUrl: './role-listing.component.html',
  styleUrls: ['./role-listing.component.scss']
})
export class RoleListingComponent implements OnInit, AfterViewInit, OnDestroy {
  pagesList: any[] = []; // List of pages
  actionList: any[] = []; // List of actions
  pageActions: any[] = []; // List of page-action mappings
  user: { id: string, userClaims: UserClaim[] } = { id: '', userClaims: [] };
  private modalRef: any;
  selectedEmailTemapletSettingID: number | null = null;
  isEditMode: boolean = false;  
  isLoading: boolean = false;  
  isCollapsed1 = false;
  isCollapsed2 = true;
  datatableConfig: Config = {};
  public emailtemplateSetting: any[] = []; 

  
  selectedAction: Roles = { 
    id: null, 
    name: '' ,  
    body: "",
    subject: "",
     };  
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('deleteSwal') deleteSwal: any;  // Reference to the confirmation Swal
  @ViewChild('successSwal') successSwal: any;  // Reference to the success Swal
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any;  // Reference to modal
  swalOptions: SweetAlertOptions = {};
    constructor(
    private roleServices: RolesApiService,
    private editroleservice: EditRoleService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
  }

openFormModal(content: any, action: 'create' | 'edit', eTemplate?: Roles): void {

   this.callApis().subscribe({
    next: (results) => {
      console.log('All requests successful', results);

      this.pagesList = results.requestOne;
      this.actionList = results.requestTwo; // Assign actions list
      this.pageActions = results.requestThree; // Assign page-actions mappings

    },
    error: (error) => {
      console.error('Error fetching API data', error);
    }
  });
  if (action === 'edit' && eTemplate) {
      this.isEditMode = true;
      this.selectedAction = { ...eTemplate };
  } else {
      this.isEditMode = false;
      this.callApis();
      this.selectedAction = {
          id: null,
          name: '',
          subject: '',
          body: ''
      };
  }
  this.modalRef = this.modalService.open(content,  { size: 'lg' });  // Store the modal reference
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
      this.modalRef.close()
    }
}

  openModal(content: any): void {
    this.modalService.open(content);
  }
  ngOnInit(): void {
    this.loadEmailTemplateSettings();
    this.datatableConfig = {
      serverSide: true,
    };
  }
  loadEmailTemplateSettings(): void {
    this.roleServices.getAllRoles().subscribe(
      
      (response) => {
        this.emailtemplateSetting = response;  
        this.cdr.detectChanges();  
        console.log('SMTP Settings loaded:', this.emailtemplateSetting);
      },
      (error) => {
        console.error('Error fetching SMTP settings:', error); 
      }
    );
  } 
  createEmailTemplateSetting(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to create this SMTP setting?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.roleServices.createRole(this.selectedAction).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire('Success', 'SMTP setting created successfully!', 'success'); // Success message
            this.loadEmailTemplateSettings(); // Reload the settings
            this.formModal.dismiss(""); // Close the modal
          },
          (error) => {
            this.isLoading = false;
            console.error('Error creating SMTP setting:', error);
            Swal.fire('Error', 'There was a problem creating the SMTP setting.', 'error'); // Error message
          }
        );
      }
    });
  } 
  // Update existing SMTP setting
  updateEmailTemplateSetting(id: number, config: Roles): void {
    this.isLoading = true;
    this.roleServices.updateRole(id, config).subscribe(
      (response) => {
        this.isLoading = false;
        this.formModal.close();  
        Swal.fire('Success', 'SMTP setting updated successfully!', 'success');
        this.loadEmailTemplateSettings();  
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating SMTP setting:', error);
      }
    );
  }
  deleteEmailTemplateSetting(id: number): void {
    if (confirm("Are you sure you want to delete this SMTP setting?")) { 
      this.roleServices.deleteRole(id).subscribe(
        (response) => {
          console.log('SMTP Setting deleted:', response);
          // After deletion, reload the SMTP settings
          this.loadEmailTemplateSettings();
        },
        (error) => {
          console.error('Error deleting SMTP setting:', error);
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
    if (id !== null) {  // Check if the ID is not null
      this.roleServices.deleteRole(id).subscribe(
        (response) => {
          console.log('SMTP Setting deleted:', response);
          this.successSwal.fire();  // Show the success Swal after deletion
          this.loadEmailTemplateSettings();  // Reload SMTP settings after deletion
        },
        (error) => {
          console.error('Error deleting SMTP setting:', error);
        }
      );
    } else {
      console.error('Error: Invalid SMTP setting ID');
    }
  }
   // Handle form submission for create or update
   onSubmit(): void {
    if (this.isEditMode) {
      this.updateEmailTemplateSetting(this.selectedAction.id!, this.selectedAction);  // Update logic
  } else {
      this.createEmailTemplateSetting();  // Create logic
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
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this.cdr.detectChanges();
    this.noticeSwal.fire();
  }

  ngOnDestroy(): void {
    this.reloadEvent.unsubscribe();
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