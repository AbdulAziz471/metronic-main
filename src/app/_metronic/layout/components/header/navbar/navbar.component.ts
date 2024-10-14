import{ Component, OnInit, ChangeDetectorRef, Input }from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProfileService } from 'src/app/Service/Profile.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userProfile: any = {};
  imgURL: string | ArrayBuffer | null = '';
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'fs-2 fs-md-1';

  constructor(private profileService: ProfileService,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        if (this.userProfile.profilePhoto) {
          this.imgURL = `${environment.apiUrl}/${this.userProfile.profilePhoto}`;
        }
        this.cdr.markForCheck(); // Trigger change detection
      },
      error: (error) => {
        console.error('Error fetching profile', error);
        this.cdr.markForCheck(); // Ensure UI updates even if there's an error
      }
    });
  }
}
