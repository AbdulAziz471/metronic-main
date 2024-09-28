import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profilePhotoUrl: string;
  constructor(private http: HttpClient) { }

  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/User/profile`);
  }
  updateProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(`${environment.apiUrl}/api/User/UpdateUserProfilePhoto`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }



  updateProfile(profileData: {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/User/profile`, profileData);
  }
}
