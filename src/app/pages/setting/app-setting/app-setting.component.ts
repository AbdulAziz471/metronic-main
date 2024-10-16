// app-setting.component.ts
import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppSettingService } from 'src/app/Service/AppSettingApi.service';
import { AppSetting } from './app-setting.model'; // Ensure this path is correct
import { Config } from 'datatables.net';
import { Observable } from 'rxjs';

import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-app-setting',
  templateUrl: './app-setting.component.html',
  styleUrls: ['./app-setting.component.scss']
})
export class AppSettingComponent implements OnInit {
  private modalRef: any;
  selectedEmailTemapletSettingID: number | null = null;
  isEditMode: boolean = false;  
  isLoading: boolean = false;  
  isCollapsed1 = false;
  isCollapsed2 = true;
  datatableConfig: Config = {};
  public AllAppSetting: any[] = []; 
  selectedAction: AppSetting = { 
    id: null, 
    name: '' ,  
    key: "",
    value: "",
     };  
  reloadEvent: EventEmitter<boolean> = new EventEmitter();


  @ViewChild('deleteSwal') deleteSwal: any;  // Reference to the confirmation Swal
  @ViewChild('successSwal') successSwal: any;  // Reference to the success Swal
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any;  // Reference to modal
  swalOptions: SweetAlertOptions = {};
    constructor(
    private AppSetting: AppSettingService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
  }

openFormModal(content: any, action: 'create' | 'edit', eTemplate?: AppSetting): void {
  if (action === 'edit' && eTemplate) {
      this.isEditMode = true;
      this.selectedAction = { ...eTemplate };
  } else {
      this.isEditMode = false;
      this.selectedAction = {
          id: null,
          name: '',
          value: '',
          key: ''
      };
  }
  this.modalRef = this.modalService.open(content);  // Store the modal reference
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
    this.loadAppSetting();
    this.datatableConfig = {
      serverSide: true,
    };
  }
  loadAppSetting(): void {
    this.AppSetting.getAllAppSettings().subscribe(
      
      (response) => {
        this.AllAppSetting = response;  
        this.cdr.detectChanges();  
        console.log('App Settings loaded:', this.AllAppSetting);
      },
      (error) => {
        console.error('Error fetching App settings:', error); 
      }
    );
  }
  // Create new SMTP setting
  createAppSettings(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to create this App setting?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.AppSetting.createAppSetting(this.selectedAction).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire('Success', 'App setting created successfully!', 'success'); 
            this.loadAppSetting(); 
            this.modalRef.close();
          },
          (error) => {
            this.isLoading = false;
            console.error('Error creating App setting:', error);
            Swal.fire('Error', 'There was a problem creating the App setting.', 'error');
          }
        );
      }
    });
  } 
  // Update existing SMTP setting
  updateAppSettings(id: number, config: AppSetting): void {
    this.isLoading = true;
    this.AppSetting.updateAppSetting(id, config).subscribe(
      (response) => {
        Swal.fire('Success', 'App setting updated successfully!', 'success');
        this.isLoading = false;
        this.modalRef.close();
        this.loadAppSetting();  
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating App setting:', error);
      }
    );
  }
  deleteAppSettings(id: number): void {
    if (confirm("Are you sure you want to delete this App setting?")) { 
      this.AppSetting.deleteAppSetting(id).subscribe(
        (response) => {
          console.log('App Setting deleted:', response);
          // After deletion, reload the SMTP settings
          this.loadAppSetting();
        },
        (error) => {
          console.error('Error deleting App setting:', error);
        }
      );
    }
  } 
  openDeleteSwal(id: number): void {
    if (id !== null) {
      this.selectedEmailTemapletSettingID = id; 
      this.deleteSwal.fire();  
    } else {
      console.error('Error: Invalid App setting ID');
    }
  }
  triggerDelete(id: number | null): void {
    if (id !== null) {  // Check if the ID is not null
      this.AppSetting.deleteAppSetting(id).subscribe(
        (response) => {
          console.log('App Setting deleted:', response);
          this.successSwal.fire();  // Show the success Swal after deletion
          this.loadAppSetting();  // Reload SMTP settings after deletion
        },
        (error) => {
          console.error('Error deleting App setting:', error);
        }
      );
    } else {
      console.error('Error: Invalid App setting ID');
    }
  }
   // Handle form submission for create or update
   onSubmit(): void {
    if (this.isEditMode) {
      this.updateAppSettings(this.selectedAction.id!, this.selectedAction);  // Update logic
  } else {
      this.createAppSettings();  // Create logic
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
