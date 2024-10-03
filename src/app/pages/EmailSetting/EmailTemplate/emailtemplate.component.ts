import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2'; 
import { Observable } from 'rxjs';
import moment from 'moment';
import { Config } from 'datatables.net';
import { Emailtemplate } from './emailtemplate.model';
import { EmailSettingService } from 'src/app/Service/EmailSettings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-emailtemplate',
  templateUrl: './emailtemplate.component.html',
  styleUrls: ['./emailtemplate.component.scss']
})
export class EmailtemplateComponent implements OnInit, AfterViewInit, OnDestroy {
  private modalRef: any;
  selectedEmailTemapletSettingID: number | null = null;
  isEditMode: boolean = false;  
  isLoading: boolean = false;  
  isCollapsed1 = false;
  isCollapsed2 = true;

  datatableConfig: Config = {};
  public emailtemplateSetting: any[] = []; 
  selectedAction: Emailtemplate = { 
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
    private emailservies: EmailSettingService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
  }

openFormModal(content: any, action: 'create' | 'edit', eTemplate?: Emailtemplate): void {
  if (action === 'edit' && eTemplate) {
      this.isEditMode = true;
      this.selectedAction = { ...eTemplate };
  } else {
      this.isEditMode = false;
      this.selectedAction = {
          id: null,
          name: '',
          subject: '',
          body: ''
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
  ngOnInit(): void {
    this.loadEmailTemplateSettings();
  }
  loadEmailTemplateSettings(): void {
    this.emailservies.getAllEmailTemplate().subscribe(
      
      (response) => {
        this.emailtemplateSetting = response;  
        this.cdr.detectChanges();  
        console.log('Email Template loaded:', this.emailtemplateSetting);
      },
      (error) => {
        console.error('Error fetching Email Template:', error); 
      }
    );
  }

  createEmailTemplateSetting(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to create this Email Template ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.emailservies.createEmailTemplate(this.selectedAction).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire('Success', 'Email Template created successfully!', 'success'); 
            this.loadEmailTemplateSettings(); 
         
         this.closeModal();

          },
          (error) => {
            this.isLoading = false;
            console.error('Error creating Email Template:', error);
            Swal.fire('Error', 'There was a problem creating the Email Template.', 'error'); // Error message
          }
        );
      }
    });
  } 
  updateEmailTemplateSetting(id: number, config: Emailtemplate): void {
    this.isLoading = true;
    this.emailservies.updateEmailTemplate(id, config).subscribe(
      (response) => {
        this.isLoading = false;
        this.formModal.close();  
        Swal.fire('Success', 'Email Template updated successfully!', 'success');
        this.loadEmailTemplateSettings();  
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating Email Template:', error);
      }
    );
  }
  deleteEmailTemplateSetting(id: number): void {
    if (confirm("Are you sure you want to delete this Email Template?")) { 
      this.emailservies.deleteEmailTemplate(id).subscribe(
        (response) => {
          console.log('Email Template deleted:', response);
          // After deletion, reload the SMTP settings
          this.loadEmailTemplateSettings();
        },
        (error) => {
          console.error('Error deleting Email Template:', error);
        }
      );
    }
  } 
  openDeleteSwal(id: number): void {
    if (id !== null) {
      this.selectedEmailTemapletSettingID = id; 
      this.deleteSwal.fire();  
    } else {
      console.error('Error: Invalid Email Template ID');
    }
  }
  triggerDelete(id: number | null): void {
    if (id !== null) {  // Check if the ID is not null
      this.emailservies.deleteEmailTemplate(id).subscribe(
        (response) => {
          console.log('Email Template deleted:', response);
          this.successSwal.fire();  // Show the success Swal after deletion
          this.loadEmailTemplateSettings();  // Reload SMTP settings after deletion
        },
        (error) => {
          console.error('Error deleting Email Template:', error);
        }
      );
    } else {
      console.error('Error: Invalid Email Template ID');
    }
  }
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
}