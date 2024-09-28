import { HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/Service/Profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  userProfile: any = {};
  defaultPhotoUrl: string = 'path/to/default/photo.jpg'; // Ensure the path is correct
  profile = {
    userName: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: ''
  };

  constructor(
    private profileService: ProfileService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.UserProfile(); 
  }
  onSubmit(): void {
    this.profileService.updateProfile(this.profile).subscribe({
      next: (response) => {
        console.log('Profile updated successfully!', response);
        // Handle successful update here
      },
      error: (error) => {
        console.error('Failed to update profile', error);
      }
    });
  }
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

  onFileSelected(event: Event): void {
    const element = event.target as HTMLInputElement;
    const file = element.files ? element.files[0] : null;
  
    if (file) {
      this.profileService.updateProfilePhoto(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.Response) {
            this.handlePhotoUpdateResponse(event.body); 
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
        }
      });
    } else {
      console.error('No file selected.');
    }
  }
  
  handlePhotoUpdateResponse(response: any): void {
    this.userProfile.profilePhotoUrl = response.newPhotoUrl || this.defaultPhotoUrl;
    this.userProfile.profilePhotoUrl += `?timestamp=${new Date().getTime()}`; // Force browser to fetch new image
    this.cd.markForCheck(); // Trigger change detection to update the view
  }
  
}
