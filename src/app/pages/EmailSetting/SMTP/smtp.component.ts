import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Observable } from 'rxjs';
import { DataTablesResponse, IUserModel, UserService } from 'src/app/_fake/services/user-service';
import { SweetAlertOptions } from 'sweetalert2';
import moment from 'moment';
import Swal from 'sweetalert2'; 
import { IRoleModel, RoleService } from 'src/app/_fake/services/role.service';
import { Config } from 'datatables.net';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SMTPSetting } from './smtp.model';
import { EmailSettingService } from 'src/app/Service/EmailSettings.service';
@Component({
  selector: 'app-smtp',
  templateUrl: './smtp.component.html',
  styleUrls: ['./smtp.component.scss']
})
export class SMTPComponent implements OnInit, AfterViewInit, OnDestroy {
  private modalRef: any;
  selectedSMTPId: number | null = null;
  isEditMode: boolean = false;  // Flag to track if editing
  isLoading: boolean = false;  
  isCollapsed1 = false;
  isCollapsed2 = true;
  users: DataTablesResponse;
  datatableConfig: Config = {};
  public smtpSettings: any[] = []; 
  selectedAction: SMTPSetting = { 
    id: null, 
    host: '' ,  
    userName: "",
    password: "",
    isMainSSL: false,
    port: 0,
    isDefault: false };  
  reloadEvent: EventEmitter<boolean> = new EventEmitter();

  aUser: Observable<IUserModel>;
  userModel: IUserModel = { id: 0, name: '', email: '', role: '' };
  @ViewChild('deleteSwal') deleteSwal: any;  // Reference to the confirmation Swal
  @ViewChild('successSwal') successSwal: any;  // Reference to the success Swal
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any;  // Reference to modal
  swalOptions: SweetAlertOptions = {};

  roles$: Observable<DataTablesResponse>;

  constructor(
    private emailservies: EmailSettingService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private apiService: UserService, private roleService: RoleService) { }

  ngAfterViewInit(): void {
  }
  // Open the form for creating or updating a setting
  openFormModal(content: any, action: 'create' | 'edit', eTemplate?: SMTPSetting): void {
    if (action === 'edit' && eTemplate) {
        this.isEditMode = true;
        this.selectedAction = { ...eTemplate };
    } else {
        this.isEditMode = false;
        this.selectedAction = {
          host: '' ,  
          userName: "",
          password: "",
          isMainSSL: false,
          port: 0,
          isDefault: false
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
    this.loadSMTPSettings();
    this.datatableConfig = {
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.apiService.getUsers(dataTablesParameters).subscribe(resp => {
          callback(resp);
        });
      },
      
      columns: [
        {
          title: 'Name', data: 'name', render: function (data, type, full) {
            const colorClasses = ['success', 'info', 'warning', 'danger'];
            const randomColorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];

            const initials = data[0].toUpperCase();
            const symbolLabel = `
              <div class="symbol-label fs-3 bg-light-${randomColorClass} text-${randomColorClass}">
                ${initials}
              </div>
            `;

            const nameAndEmail = `
              <div class="d-flex flex-column" data-action="view" data-id="${full.id}">
                <a href="javascript:;" class="text-gray-800 text-hover-primary mb-1">${data}</a>
                <span>${full.email}</span>
              </div>
            `;

            return `
              <div class="symbol symbol-circle symbol-50px overflow-hidden me-3" data-action="view" data-id="${full.id}">
                <a href="javascript:;">
                  ${symbolLabel}
                </a>
              </div>
              ${nameAndEmail}
            `;
          }
        },
        {
          title: 'Role', data: 'role', render: function (data, type, row) {
            const roleName = row.roles[0]?.name;
            return roleName || '';
          },
          orderData: [1],
          orderSequence: ['asc', 'desc'],
          type: 'string',
        },
        {
          title: 'Last Login', data: 'last_login_at', render: (data, type, full) => {
            const date = data || full.created_at;
            const dateString = moment(date).fromNow();
            return `<div class="badge badge-light fw-bold">${dateString}</div>`;
          }
        },
        {
          title: 'Joined Date', data: 'created_at', render: function (data) {
            return moment(data).format('DD MMM YYYY, hh:mm a');;
          }
        }
      ],
      createdRow: function (row, data, dataIndex) {
        $('td:eq(0)', row).addClass('d-flex align-items-center');
      },
    };

    this.roles$ = this.roleService.getRoles();
  }
  loadSMTPSettings(): void {
    this.emailservies.getAllSMTPSettings().subscribe(
      
      (response) => {
        this.smtpSettings = response;  
        this.cdr.detectChanges();  
        console.log('SMTP Settings loaded:', this.smtpSettings);
      },
      (error) => {
        console.error('Error fetching SMTP settings:', error); 
      }
    );
  }
  // Create new SMTP setting
  createSMTPSetting(): void {
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
        this.emailservies.createSMTPSetting(this.selectedAction).subscribe(
          (response) => {
            this.isLoading = false;
            Swal.fire('Success', 'SMTP setting created successfully!', 'success'); // Success message
            this.loadSMTPSettings(); // Reload the settings
            this.formModal.close(); // Close the modal
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
  updateSMTPSetting(id: number, config: SMTPSetting): void {
    this.isLoading = true;
    this.emailservies.updateSMTPSetting(id, config).subscribe(
      (response) => {
        this.isLoading = false;
        this.formModal.close();  // Close the modal after success
        Swal.fire('Success', 'SMTP setting updated successfully!', 'success');
        this.loadSMTPSettings();  // Reload the settings
      },
      (error) => {
        this.isLoading = false;
        console.error('Error updating SMTP setting:', error);
      }
    );
  }
  deleteSMTPSetting(id: number): void {
    if (confirm("Are you sure you want to delete this SMTP setting?")) { 
      this.emailservies.deleteSMTPSetting(id).subscribe(
        (response) => {
          console.log('SMTP Setting deleted:', response);
          // After deletion, reload the SMTP settings
          this.loadSMTPSettings();
        },
        (error) => {
          console.error('Error deleting SMTP setting:', error);
        }
      );
    }
  }
  
  openDeleteSwal(id: number): void {
    if (id !== null) {
      this.selectedSMTPId = id; 
      this.deleteSwal.fire();  
    } else {
      console.error('Error: Invalid SMTP setting ID');
    }
  }
  
  triggerDelete(id: number | null): void {
    if (id !== null) {  // Check if the ID is not null
      this.emailservies.deleteSMTPSetting(id).subscribe(
        (response) => {
          console.log('SMTP Setting deleted:', response);
          this.successSwal.fire();  // Show the success Swal after deletion
          this.loadSMTPSettings();  // Reload SMTP settings after deletion
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
      this.updateSMTPSetting(this.selectedAction.id as number, this.selectedAction);
    } else {
      this.createSMTPSetting();
    }
  }
  // onSubmit(event: Event, myForm: NgForm) {
  //   if (myForm && myForm.invalid) {
  //     return;
  //   }

  //   this.isLoading = true;

  //   const successAlert: SweetAlertOptions = {
  //     icon: 'success',
  //     title: 'Success!',
  //     text: this.userModel.id > 0 ? 'User updated successfully!' : 'User created successfully!',
  //   };
  //   const errorAlert: SweetAlertOptions = {
  //     icon: 'error',
  //     title: 'Error!',
  //     text: '',
  //   };

  //   const completeFn = () => {
  //     this.isLoading = false;
  //   };

  //   const updateFn = () => {
  //     this.apiService.updateUser(this.userModel.id, this.userModel).subscribe({
  //       next: () => {
  //         this.showAlert(successAlert);
  //         this.reloadEvent.emit(true);
  //       },
  //       error: (error) => {
  //         errorAlert.text = this.extractText(error.error);
  //         this.showAlert(errorAlert);
  //         this.isLoading = false;
  //       },
  //       complete: completeFn,
  //     });
  //   };

  //   const createFn = () => {
  //     this.userModel.password = 'test123';
  //     this.apiService.createUser(this.userModel).subscribe({
  //       next: () => {
  //         this.showAlert(successAlert);
  //         this.reloadEvent.emit(true);
  //       },
  //       error: (error) => {
  //         errorAlert.text = this.extractText(error.error);
  //         this.showAlert(errorAlert);
  //         this.isLoading = false;
  //       },
  //       complete: completeFn,
  //     });
  //   };

  //   if (this.userModel.id > 0) {
  //     updateFn();
  //   } else {
  //     createFn();
  //   }
  // }

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