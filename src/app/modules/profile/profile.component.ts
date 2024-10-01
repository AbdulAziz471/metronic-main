import { HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProfileService } from 'src/app/Service/Profile.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import Swal from 'sweetalert2';
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
  selectedProfile: Profile;
  private modalRef: NgbModalRef;
  userProfile: any = {};
  defaultPhotoUrl: string = 'path/to/default/photo.jpg'; 
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
  swalOptions: SweetAlertOptions = {};
  constructor(  
    private modalService: NgbModal,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef 
  ) {}
  ngOnInit(): void {
    this.UserProfile(); 
  }
  // onSubmit(): void {
  //   this.profileService.updateProfile(this.profile).subscribe({
  //     next: (response) => {
  //       console.log('Profile updated successfully!', response);
  //     },
  //     error: (error) => {
  //       console.error('Failed to update profile', error);
  //     }
  //   });
  // console.log('Updating profile:', this.selectedProfile);
  // this.closeModal();
  // }
  UserProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (response) => {
        this.userProfile = response;
        this.userProfile.profilePhotoUrl = response.profilePhotoUrl || this.defaultPhotoUrl; 
        this.cd.detectChanges(); 
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.userProfile.profilePhotoUrl = this.defaultPhotoUrl;
      }
    });
  }


  // Method to open the modal with the profile content to be updated
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

  // Close the modal
  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  // Handle form submission for updating profile
  onSubmit(): void {
    this.profileService.updateProfile(this.selectedProfile).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        // Handle error by showing user-friendly message or logging
      }
    });
  }
    // Handle form submission for updating profile
    onChangeSubmit(): void {
      this.profileService.updateProfile(this.selectedProfile).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          // Handle error by showing user-friendly message or logging
        }
      });
    }
}
