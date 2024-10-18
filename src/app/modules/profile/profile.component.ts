import { HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProfileService } from 'src/app/Service/Profile.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
interface Profile {
  id?: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  changePasswordForm: FormGroup;
  imgURL: any;
  selectedProfile: Profile;
  private modalRef: NgbModalRef;
  userProfile: any = {};
  isLoading: boolean = false;  
  profile = {
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: ''
  };
  @ViewChild('deleteSwal') deleteSwal: any; 
  @ViewChild('successSwal') successSwal: any;
  @ViewChild('noticeSwal') noticeSwal!: SwalComponent;
  @ViewChild('formModal') formModal: any;
  @ViewChild('ChangeformModal') ChangeformModal: any;  
  swalOptions: SweetAlertOptions = {};
  constructor(  
    private fb: FormBuilder,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef 
  ) {
    this.createForm();
  }
  ngOnInit(): void {
    this.UserProfile(); 
  }
  private createForm() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator('newPassword', 'confirmPassword')
    });
  }

  passwordMatchValidator(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) return null;
      const mismatch = passwordControl.value !== confirmPasswordControl.value;
      if (mismatch) {
        confirmPasswordControl.setErrors({ mismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }
  onpasswordSubmit() { 
    if (this.changePasswordForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please correct the errors in the form'
      });
      return;
    }

    const formValues = this.changePasswordForm.value;
    const payload = {
      email: "",
      userName: this.userProfile.userName,
      oldPassword: formValues.oldPassword,
      newPassword: formValues.newPassword
    };

    this.profileService.changePassword(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password changed successfully!'
        });
        this.modalRef.close();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: 'Failed to change password'
        });
      }
    });
  }
  UserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.userProfile = response;
        this.userProfile.profilePhotoUrl = response.profilePhotoUrl;
        this.imgURL = null; // Reset imgURL on profile load
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
      }
    });
  }
  
  fileEvent($event: Event): void {
    const inputElement = $event.target as HTMLInputElement;
    const file = inputElement.files ? inputElement.files[0] : null;
    if (file) {
      this.profileService.updateProfilePhoto(file).subscribe({
        next: (response) => {
          this.imgURL = URL.createObjectURL(file); // Update imgURL to show the new image
          this.cd.detectChanges();
        },
        error: (error) => {
          console.error('Error updating image', error);
        }
      });
    } else {
      console.error('No file selected');
    }
  }
  
  // fileEvent($event: Event): void {
  //   const inputElement = $event.target as HTMLInputElement;
  //   const file = inputElement.files ? inputElement.files[0] : null;
  //   if (file) {
  //     this.profileService.updateProfilePhoto( file).subscribe({
  //       next: (response) => {
  //         this.imgURL = URL.createObjectURL(file); 
  //         this.cd.detectChanges();
  //       },
  //       error: (error) => {
  //         console.error('Error updating image', error);
  //         }
  //     });
  //   } else {
  //     console.error('No file selected');
  //   }
  // }
    
  
  openFormModal(content: TemplateRef<any>, profile: Profile): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.selectedProfile = { ...response };
        this.modalRef = this.modalService.open(content);
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        // Handle error by showing user-friendly message or logging
      }
    });
  }
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  // Handle form submission for updating profile
  onSubmit() {
    if (this.userProfile) {
      this.profileService.updateProfile(this.userProfile).subscribe({
        next: response => {
          console.log('Profile updated successfully');
          // Show success message using Swal
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your profile has been updated successfully.'
          });
          this.modalRef.close();
        },
        error: error => {
          console.error('Failed to update profile', error);
          // Show error message using Swal
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'There was a problem updating your profile.'
          });
        }
      });
    } else {
      // Handle scenario when userProfile is not defined or invalid
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please check your profile details before submitting.'
      });
    }
  }
  
   

  
}
