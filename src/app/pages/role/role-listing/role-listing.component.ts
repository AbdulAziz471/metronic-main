import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';
import { Config } from 'datatables.net';
import { Observable } from 'rxjs';
import { Action, Page, RoleClaim, Roles } from './role.model';
import { EditRoleService } from 'src/app/Service/EditRole.Service';
import { RolesApiService } from 'src/app/Service/RolesApi.service';
import { forkJoin } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-role-listing',
  templateUrl: './role-listing.component.html',
  styleUrls: ['./role-listing.component.scss'],
})
export class RoleListingComponent implements OnInit, AfterViewInit, OnDestroy {
  pagesList: any[] = []; // List of pages
  actionList: any[] = []; // List of actions
  pageActions: any[] = []; // List of page-action mappings
  role: { id: string; name?: string; roleClaims: RoleClaim[] } = {
    id: '',
    name: '',
    roleClaims: [],
  };
   modalRef: any;
  selectedEmailTemapletSettingID: number | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  isCollapsed1 = false;
  isCollapsed2 = true;
  datatableConfig: Config = {};
  public emailtemplateSetting: any[] = [];

  selectedAction: Roles = {
    id: '',
    name: '',
    roleClaims: [],
  };

  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('deleteSwal') deleteSwal: any; // Reference to the confirmation Swal
  @ViewChild('successSwal') successSwal: any; // Reference to the success Swal
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any; // Reference to modal
  swalOptions: SweetAlertOptions = {};
  constructor(
    private roleServices: RolesApiService,
    private editroleservice: EditRoleService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {}
 
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

  openModal(content: any): void {
    this.modalService.open(content);
  }
  ngOnInit(): void {
    this.loadRoles();
    this.datatableConfig = {
      serverSide: true,
    };
  }
  loadRoles(): void {
    this.roleServices.getAllRoles().subscribe(
      (response) => {
        this.emailtemplateSetting = response;
        this.cdr.detectChanges();
        console.log('Roles loaded:', this.emailtemplateSetting);
      },
      (error) => {
        console.error('Error fetching Role', error);
      }
    );
  }
  CreateRole(): void {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to create this Role?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, create it!',
    }).then((result) => {
        if (result.isConfirmed) {
            this.isLoading = true;
            this.roleServices.createRole(this.selectedAction).subscribe(
                (response) => {
                    Swal.fire('Success', 'Role created successfully!', 'success'); // Success message
                    this.cdr.detectChanges(); 
                    // Load roles after the role is successfully created
                    this.formModal.dismiss(''); // Close the modal
                    this.isLoading = false;
                },
                (error) => {
                    console.error('Error creating Role:', error);
                    Swal.fire(
                        'Error',
                        'There was a problem creating the Role.',
                        'error'
                    ); // Error message
                    this.isLoading = false;
                }
            );
        }
        debugger;
        this.loadRoles(); 
    });
} 

  updateRole(id: string, config: Roles): void {
    this.isLoading = true;
    this.roleServices.updateRole(id, config).subscribe(
      (response) => {
        this.isLoading = false;
        this.formModal.close();
        Swal.fire('Success', 'Role updated successfully!', 'success');
        this.loadRoles();
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating Role:', error);
      }
    );
  }
  deleteRole(id: number): void {
    if (confirm('Are you sure you want to delete this Role?')) {
      this.roleServices.deleteRole(id).subscribe(
        (response) => {
          console.log('Role deleted:', response);
          // After deletion, reload the SMTP settings
          this.loadRoles();
        },
        (error) => {
          console.error('Error deleting Role:', error);
        }
      );
    }
  }
  openDeleteSwal(id: number): void {
    if (id !== null) {
      this.selectedEmailTemapletSettingID = id;
      this.deleteSwal.fire();
    } else {
      console.error('Error: Invalid role setting ID');
    }
  }
  triggerDelete(id: number | null): void {
    if (id !== null) {
      // Check if the ID is not null
      this.roleServices.deleteRole(id).subscribe(
        (response) => {
          console.log('Role Setting deleted:', response);
          this.successSwal.fire(); // Show the success Swal after deletion
          this.loadRoles(); // Reload SMTP settings after deletion
        },
        (error) => {
          console.error('Error deleting Role:', error);
        }
      );
    } else {
      console.error('Error: Invalid role ID');
    }
  }
 

  extractText(obj: any): string {
    var textArray: string[] = [];

    for (var key in obj) {
      if (typeof obj[key] === 'string') {
        textArray.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        textArray = textArray.concat(this.extractText(obj[key]));
      }
    }

    var uniqueTextArray = Array.from(new Set(textArray));

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
// openFormModal(content: any, action: 'create' | 'edit', eTemplate?: Roles): void {
//     this.callApis().subscribe({
//       next: (results) => {
//         this.pagesList = results.requestOne;
//         this.actionList = results.requestTwo;
//         this.pageActions = results.requestThree;

//         if (action === 'edit' && eTemplate && eTemplate.id) {
//           this.isEditMode = true;
//           this.roleServices.getRollbyId(eTemplate.id).subscribe({
//             next: (roleDetails) => {
//               console.log('Fetched Role Details:', roleDetails); // Debug fetched role details
//               this.selectedAction = { ...roleDetails };
//               console.log('Initialized Selected Action:', this.selectedAction); // Debug initialized role
//               this.modalRef = this.modalService.open(content, { size: 'lg' });
//             },
//             error: (error) => {
//               console.error('Error fetching role by ID:', error);
//             },
//           });
//         }
//          else {
//           this.isEditMode = false;
//           this.selectedAction = {
//             id: '',
//             name: '',
//             roleClaims: [],
//           };
//           this.modalRef = this.modalService.open(content, { size: 'lg' });
//         }
//       },
//       error: (error) => console.error('Error fetching API data:', error)
//     });
// }


onSubmit(): void {
  if (this.selectedAction.roleClaims.length === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please select at least one permission before submitting!',
    });
    return;
  }

  // Determine create or update action based on mode
  if (this.isEditMode) {
    // Assuming the ID is part of the selectedAction object
    if (this.selectedAction.id) {
      this.roleServices.updateRole(this.selectedAction.id, this.selectedAction).subscribe({
        next: () => {
          Swal.fire('Success', 'Role updated successfully!', 'success');
          this.modalRef.close();
        },
        error: (err) => {
          console.error('Error updating role:', err);
          Swal.fire('Error', 'There was a problem updating the role.', 'error');
        }
      });
    } else {
      console.error('Error: Role ID is missing');
      Swal.fire('Error', 'Cannot update role without an ID.', 'error');
    }
  } else {
    this.roleServices.createRole(this.selectedAction).subscribe({
      next: () => {
        Swal.fire('Success', 'Role created successfully!', 'success');
        this.modalRef.close();
        debugger;
        this.loadRoles(); 
      },
      error: (err) => {
        console.error('Error creating role:', err);
        Swal.fire('Error', 'There was a problem creating the role.', 'error');
      }
    });
  }
  
  }
  openFormModal(content: any, action: 'create' | 'edit', eTemplate?: Roles): void {
    this.callApis().subscribe({
      next: (results) => {
        this.pagesList = results.requestOne;
        this.actionList = results.requestTwo;
        this.pageActions = results.requestThree;

        if (action === 'edit' && eTemplate && eTemplate.id) {
          this.isEditMode = true;
          this.roleServices.getRollbyId(eTemplate.id).subscribe({
            next: (roleDetails) => {
              this.selectedAction = { ...roleDetails };
              this.cdr.detectChanges();
              console.log('Initialized Selected Action:', this.selectedAction);
              this.modalRef = this.modalService.open(content, { size: 'lg' });
            },
            error: (error) => console.error('Error fetching role by ID:', error)
          });
        } else {
          this.isEditMode = false;
          this.selectedAction = {
            id: '',
            name: '',
            roleClaims: [] 
          };
          this.loadRoles();
          this.modalRef = this.modalService.open(content, { size: 'lg' });
        }
      },
      error: (error) => console.error('Error fetching API data:', error)
    });
  }

  checkPageAction(pageId: string, actionId: string): boolean {
    return this.pageActions.some(pa => pa.pageId === pageId && pa.actionId === actionId);
  }

  checkPermission(pageId: string, actionId: string): boolean {
    const foundClaim = this.selectedAction.roleClaims.find(claim => claim.pageId === pageId && claim.actionId === actionId);
    console.log(`Checking permission for Page ID: ${pageId}, Action ID: ${actionId}`, foundClaim);
    return !!foundClaim && foundClaim.claimValue === 'true';
  }
  

  onPermissionChange(event: MatSlideToggleChange, page: Page, action: Action): void {
    const foundClaim = this.selectedAction.roleClaims.find(claim => claim.pageId === page.id && claim.actionId === action.id);

    if (event.checked) {
      if (!foundClaim) {
        this.selectedAction.roleClaims.push({
          claimType: `${page.name}_${action.name}`,
          claimValue: 'true',
          pageId: page.id!,
          actionId: action.id!
        });
        console.log(`Claim added: ${page.name} - ${action.name}`);
      } else {
        foundClaim.claimValue = 'true'; // Update existing claim to 'true'
      }
    } else {
      if (foundClaim) {
        foundClaim.claimValue = 'false'; // Update existing claim to 'false'
        console.log(`Claim removed: ${page.name} - ${action.name}`);
      }
    }
  }
}
