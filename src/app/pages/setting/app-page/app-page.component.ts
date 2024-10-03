// app-setting.component.ts
import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppSettingService } from 'src/app/Service/AppSettingApi.service';
import { AppSetting } from './app-page.model'; 
import { Config } from 'datatables.net';
import { Observable } from 'rxjs';
import { AppPageApiService } from 'src/app/Service/AppPageApi.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-app-setting',
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss']
})
export class AppPageComponent implements OnInit {
  pages = []; 
  private modalRef: any;
  filteredPages: any[] = [];
  searchTerm: string = '';
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
    url: ''
     };  
  reloadEvent: EventEmitter<boolean> = new EventEmitter();


  @ViewChild('deleteSwal') deleteSwal: any;  // Reference to the confirmation Swal
  @ViewChild('successSwal') successSwal: any;  // Reference to the success Swal
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any;  // Reference to modal
  swalOptions: SweetAlertOptions = {};
    constructor(
    private AppPages: AppPageApiService,
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
          url: '',
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
    this.filteredPages = this.AllAppSetting;
    this.loadAppPage();
    this.datatableConfig = {
      serverSide: true,
    };
  }
  loadAppPage(): void {
    this.AppPages.getAllAppPage().subscribe(
      
      (response) => {
        this.AllAppSetting = response;  
        this.cdr.detectChanges();  
        console.log('SMTP Settings loaded:', this.AllAppSetting);
      },
      (error) => {
        console.error('Error fetching SMTP settings:', error); 
      }
    );
  }

  filterSettings() {
    if (!this.searchTerm) {
      this.filteredPages = this.AllAppSetting;
    } else {
      this.filteredPages = this.AllAppSetting.filter(setting =>
        setting.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }
  // Create new SMTP setting
  createAppPage(): void {
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
        // Assuming createAppPage now accepts an object with name and url
        this.AppPages.createAppPage({
          name: this.selectedAction.name,
          url: this.selectedAction.url // Make sure this is the correct property for the URL
        }).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire('Success', 'SMTP setting created successfully!', 'success');
            this.loadAppPage();
            this.formModal.dismiss("");
          },
          (error) => {
            this.isLoading = false;
            console.error('Error creating SMTP setting:', error);
            Swal.fire('Error', 'There was a problem creating the SMTP setting.', 'error');
          }
        );
      }
    });
  }
  
  // Update existing SMTP setting
  updateEmailTemplateSetting(id: number, config: AppSetting): void {
    this.isLoading = true;
    this.AppPages.updateAppPage(id,).subscribe(
      (response) => {
        this.isLoading = false;
        this.formModal.close();  
        Swal.fire('Success', 'SMTP setting updated successfully!', 'success');
        this.loadAppPage();  
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating SMTP setting:', error);
      }
    );
  }
  deleteEmailTemplateSetting(id: number): void {
    if (confirm("Are you sure you want to delete this SMTP setting?")) { 
      this.AppPages.deleteAppPage(id).subscribe(
        (response) => {
          console.log('SMTP Setting deleted:', response);
          // After deletion, reload the SMTP settings
          this.loadAppPage();
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
      this.AppPages.deleteAppPage(id).subscribe(
        (response) => {
          console.log('SMTP Setting deleted:', response);
          this.successSwal.fire();  // Show the success Swal after deletion
          this.loadAppPage();  // Reload SMTP settings after deletion
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
      this.createAppPage();  // Create logic
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
