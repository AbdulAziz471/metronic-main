import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profilePhotoUrl: string | undefined;

  constructor(private http: HttpClient) { }

  // Get the current user profile
  getProfile(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/User/profile`).pipe(
      catchError(this.handleError)
    );
  }
  updateProfile(profileData: {
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
  }): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/User/profile`, profileData).pipe(
      catchError(this.handleError)
    );
  }

  // Upload and update the profile photo
  updateProfilePhoto(file: File): Observable<any> {
    const formData = new FormData();
    formData.append(file.name,file);
    //formData.append('file', file);

    return this.http.post(`${environment.apiUrl}/api/User/UpdateUserProfilePhoto`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Generic error handling
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
