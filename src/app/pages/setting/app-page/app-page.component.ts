import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppPageApiService } from 'src/app/Service/AppPageApi.service';
import { AppSetting } from './app-page.model'; 
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal, { SweetAlertOptions } from 'sweetalert2';
@Component({
  selector: 'app-app-setting',
  templateUrl: './app-page.component.html',
  styleUrls: ['./app-page.component.scss']
})
export class AppPageComponent implements OnInit {
  private modalRef: any;
  public AllAppSetting: AppSetting[] = [];
  filteredPages: AppSetting[] = [];
  isEditMode: boolean = false;  
  searchTerm: string = '';
  isLoading: boolean = false;  
  selectedAction: AppSetting = { 
    id: null, 
    name: '' ,  
    url: ''
     };  
  @ViewChild('formModal') formModal: any;  // Reference to modal

  constructor(
    private AppPages: AppPageApiService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAppPage(); // Load the list when component initializes
  }

  // Fetch app settings from API and display them
  loadAppPage(): void {
    this.AppPages.getAllAppPage().subscribe(
      (response) => {
        this.AllAppSetting = response;  
        this.filteredPages = this.AllAppSetting;  // Set filteredPages to display all initially
        this.cdr.detectChanges();
        console.log('App settings loaded:', this.AllAppSetting);
      },
      (error) => {
        console.error('Error fetching app settings:', error); 
      }
    );
  }
  filterSettings(): void {
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
  updateAppPage(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to update this App Page?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.AppPages.updateAppPage(this.selectedAction).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire('Success', 'App Page updated successfully!', 'success');
            this.loadAppPage();  // Reload the settings list after the update
            this.formModal.dismiss("");  // Close the modal
          },
          (error) => {
            this.isLoading = false;
            console.error('Error updating App Page:', error);
            Swal.fire('Error', 'There was a problem updating the App Page.', 'error');
          }
        );
      }
    });
  }
  
  openFormModal(content: any, action: 'create' | 'edit', eTemplate?: AppSetting): void {
    if (action === 'edit' && eTemplate) {
        this.isEditMode = true;
        this.selectedAction = { ...eTemplate };  // Pre-fill the form with the selected setting data
    } else {
        this.isEditMode = false;
        this.selectedAction = {
            id: null,
            name: '',
            url: '',
        };
    }
    this.modalRef = this.modalService.open(content);
  }
  closeModal(): void {
    if (this.modalRef) {
        this.modalRef.close()
      }
  }
  openModal(content: any): void {
      this.modalService.open(content);
  }

 
  onSubmit(): void {
    if (this.isEditMode) {
      this.updateAppPage();  // Call update if in edit mode
    } else {
      this.createAppPage();  // Call create if in create mode
    }
  }
  deleteAppSetting(id: any): void {
    if (!id) {
      console.error('Invalid ID:', id);
      return;
    }
  
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
        this.AppPages.deleteAppPage(id).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'The app setting has been deleted.', 'success');
            this.loadAppPage();  // Reload the settings list after deletion
          },
          (error) => {
            console.error('Error deleting app setting:', error);
            Swal.fire('Error', 'There was a problem deleting the app setting.', 'error');
          }
        );
      }
    });
  }
  
  
}
