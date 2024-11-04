/* eslint-disable @angular-eslint/use-lifecycle-interface */
// app-actions.component.ts
import { Component, OnInit , ChangeDetectorRef, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppAction } from './app-action.modal';
import { AppActionService } from 'src/app/Service/AppActionsApi.service';
import { Config } from 'datatables.net';
import { Observable } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { AuthApiService } from 'src/app/Service/AuthApi.service';
@Component({
  selector: 'app-app-actions',  // Make sure the selector matches the file name if needed
  templateUrl: './app-actions.component.html',
  styleUrls: ['./app-actions.component.scss']
})
export class AppActionsComponent implements OnInit {
  

  private modalRef: any;
  selectedAppActionID: number | null = null;
  isEditMode: boolean = false;  
  isLoading: boolean = false;  
  isCollapsed1 = false;
  isCollapsed2 = true;
  datatableConfig: Config = {};
  public AllAppActions: any[] = []; 
  selectedAction: AppAction = { 
    id: null, 
    name: '' , 
     };  
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('deleteSwal') deleteSwal: any;  // Reference to the confirmation Swal
  @ViewChild('successSwal') successSwal: any;  // Reference to the success Swal
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any;  // Reference to modal
  swalOptions: SweetAlertOptions = {};
    constructor(
    private AppAction: AppActionService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private authService : AuthApiService,
  ) { }

  ngAfterViewInit(): void {
  }
  hasPermission(permission: string): boolean {
    return this.authService.hasClaim(permission);
  }
openFormModal(content: any, action: 'create' | 'edit', eTemplate?: AppAction): void {
  if (action === 'edit' && eTemplate) {
      this.isEditMode = true;
      this.selectedAction = { ...eTemplate };
  } else {
      this.isEditMode = false;
      this.selectedAction = {
          id: null,
          name: '',
      };
  }
  this.modalRef = this.modalService.open(content);  // Store the modal reference
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
    this.loadAppActions();
    this.datatableConfig = {
      serverSide: true,
    };
  }
  loadAppActions(): void {
    this.AppAction.getAllAppAction().subscribe(
      
      (response) => {
        this.AllAppActions = response;  
        this.cdr.detectChanges();  
        console.log('Actions loaded:', this.AllAppActions);
      },
      (error) => {
        console.error('Error fetching Actions:', error); 
      }
    );
  }
  // Create new SMTP setting
  createEmailTemplateSetting(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to create this App Actions?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.AppAction.createAppAction(this.selectedAction.name).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire('Success', 'App Action created successfully!', 'success'); 
            this.loadAppActions(); 
            this.modalRef.close(); 
          },
          (error) => {
            this.isLoading = false;
            console.error('Error creating App Action:', error);
            Swal.fire('Error', 'There was a problem creating the App Action.', 'error');
          }
        );
      }
    });
  } 

UpdateAppActionsSetting(config: AppAction): void {
  if (!config.id) {
      console.error('Invalid or missing ID');
      return;
  }
  this.isLoading = true;
  this.AppAction.updateAppAction(config).subscribe(
      (response) => {
          this.isLoading = false;
          this.modalRef.close(); 
          Swal.fire('Success', 'App Action updated successfully!', 'success');
          this.loadAppActions();  
      },
      (error) => {
          this.isLoading = false;
          console.error('Error updating app setting:', error);
          Swal.fire('Error', 'There was a problem updating the app setting.', 'error');
      }
  );
}

  deleteEmailTemplateSetting(id: number): void {
    if (confirm("Are you sure you want to delete this App Action?")) { 
      this.AppAction.deleteAppAction(id).subscribe(
        (response) => {
          console.log('SMTP Setting deleted:', response);
          this.loadAppActions();
        },
        (error) => {
          console.error('Error deleting App Action:', error);
        }
      );
    }
  } 
  openDeleteSwal(id: number): void {
    if (id !== null) {
      this.selectedAppActionID = id; 
      this.deleteSwal.fire();  
    } else {
      console.error('Error: Invalid App Action ID');
    }
  }
  triggerDelete(id: number | null): void {
    if (id !== null) {  // Check if the ID is not null
      this.AppAction.deleteAppAction(id).subscribe(
        (response) => {
          console.log('SMTP Setting deleted:', response);
          this.successSwal.fire();  // Show the success Swal after deletion
          this.loadAppActions();  // Reload SMTP settings after deletion
        },
        (error) => {
          console.error('Error deleting App Action:', error);
        }
      );
    } else {
      console.error('Error: Invalid App Action ');
    }
  }
   // Handle form submission for create or update
   onSubmit(): void {
    if (this.isEditMode) {
      this.UpdateAppActionsSetting(this.selectedAction);  // Update logic
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
}
