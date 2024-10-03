import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
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

  updateProfilePhoto( file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${environment.apiUrl}/api/User/UpdateUserProfilePhoto`; // Adjusted to include userId in the URL if necessary

    return this.http.post(url, formData).pipe(
      catchError(error => {
        console.error('An error occurred:', error);
        // Optionally convert the error to a more general observable or handle it as needed
        throw error; // Rethrow the error if you want to handle it in the subscribing component
      })
    );
  }
}
