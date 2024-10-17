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

  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('successSwal') successSwal: any;
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
  createRole(roleData: Roles): void {
    this.isLoading = true;
    this.roleServices
      .createRole({
        name: roleData.name,
        roleClaims: roleData.roleClaims.map((claim) => ({
          claimType: claim.claimType,
          claimValue: claim.claimValue,
          pageId: claim.pageId,
          actionId: claim.actionId,
        })),
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          Swal.fire('Success', 'Role created successfully!', 'success');
          this.loadRoles(); // Refresh the list of roles
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating Role:', error);
          Swal.fire('Error', 'Failed to create Role.', 'error');
        },
      });
  }

  updateRole(role: Roles): void {
    this.isLoading = true;

    // Map through roleClaims to ensure all necessary properties are included
    const updatedRoleClaims = role.roleClaims.map((claim) => ({
      id: claim.id, // Ensure to maintain the claim ID if it exists
      roleId: role.id,
      claimType: claim.claimType,
      claimValue: claim.claimValue,
      pageId: claim.pageId,
      actionId: claim.actionId,
    }));

    const updatedRole = {
      ...role,
      roleClaims: updatedRoleClaims,
    };

    this.roleServices.updateRole(role.id, updatedRole).subscribe(
      (response) => {
        this.isLoading = false;
        this.formModal.close();
        Swal.fire('Success', 'Role updated successfully!', 'success');
        this.loadRoles();
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating Role:', error);
        Swal.fire('Error', 'Failed to update role.', 'error');
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

  openFormModal(
    content: any,
    action: 'create' | 'edit',
    eTemplate?: Roles
  ): void {
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
            error: (error) =>
              console.error('Error fetching role by ID:', error),
          });
        } else {
          this.isEditMode = false;
          this.selectedAction = {
            id: '',
            name: '',
            roleClaims: [],
          };
          this.loadRoles();
          this.modalRef = this.modalService.open(content, { size: 'lg' });
        }
      },
      error: (error) => console.error('Error fetching API data:', error),
    });
  }

  checkPageAction(pageId: string, actionId: string): boolean {
    return this.pageActions.some(
      (pa) => pa.pageId === pageId && pa.actionId === actionId
    );
  }

  checkPermission(pageId: string, actionId: string): boolean {
    const foundClaim = this.selectedAction.roleClaims.find(
      (claim) =>
        claim.pageId === pageId &&
        claim.actionId === actionId &&
        claim.claimValue === 'true'
    );
    return !!foundClaim;
  }

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
        this.roleServices
          .updateRole(this.selectedAction.id, this.selectedAction)
          .subscribe({
            next: () => {
              Swal.fire('Success', 'Role updated successfully!', 'success');
              this.modalRef.close();
            },
            error: (err) => {
              console.error('Error updating role:', err);
              Swal.fire(
                'Error',
                'There was a problem updating the role.',
                'error'
              );
            },
          });
      } else {
        console.error('Error: Role ID is missing');
        Swal.fire('Error', 'Cannot update role without an ID.', 'error');
        this.cdr.detectChanges();
      }
    } else {
      // Prepare the roleClaims for creation
      const creationPayload = {
        name: this.selectedAction.name,
        roleClaims: this.selectedAction.roleClaims.map((claim) => ({
          claimType: claim.claimType,
          claimValue: claim.claimValue || 'true', // Set a default value if necessary
          pageId: claim.pageId,
          actionId: claim.actionId,
        })),
      };

      this.roleServices.createRole(creationPayload).subscribe({
        next: () => {
          Swal.fire('Success', 'Role created successfully!', 'success');
          this.modalRef.close();
          this.loadRoles(); // Refresh roles list after creation
        },
        error: (err) => {
          console.error('Error creating role:', err);
          // Check if the error is related to the role already existing
          if (err?.status === 409 || err?.message === 'Role already exists') {
            Swal.fire('Error', 'Role already exists.', 'error');
          } else {
            Swal.fire(
              'Error',
              'There was a problem creating the role.',
              'error'
            );
          }
        },
      });
    }
  }

  onPermissionChange(
    event: MatSlideToggleChange,
    page: Page,
    action: Action
  ): void {
    const foundClaim = this.selectedAction.roleClaims.find(
      (claim) => claim.pageId === page.id && claim.actionId === action.id
    );
  
    if (event.checked) {
      if (!foundClaim) {
        // Adding a new claim if it does not exist
        this.selectedAction.roleClaims.push({
          roleId: this.selectedAction.id,
          claimType: `${page.name}_${action.name}`,
          claimValue: 'true',
          pageId: page.id!,
          actionId: action.id!,
        });
      } else {
     
        foundClaim.claimValue = 'true';
      }
    } else {
      if (foundClaim) {
        foundClaim.claimValue = 'false';
      }
    }
  }
}
