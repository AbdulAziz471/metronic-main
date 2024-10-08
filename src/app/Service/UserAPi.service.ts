import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { UserQueryParams } from '../pages/user/user-listing/users.modal';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getAllUsers(params: UserQueryParams): Observable<any> {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params[key] !== undefined) {
        let value = params[key];
        // Convert boolean true/false to '1'/'0'
        if (typeof value === 'boolean') {
          value = value ? '1' : '0';
        }
        httpParams = httpParams.set(key, value.toString());
      }
    }
  
    return this.http.get(`${environment.apiUrl}/api/User/GetUsers`, { params: httpParams });
  }
  getAllPageAction(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/pageactions`);
  }
  
  
  // GET: Fetch a single SMTP Setting by ID
  getUserbyId(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/User/${id}`);
  }

  // POST: Create a new User 
  createUser(config: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/User`, config);
  }
// POST: Create a new User 
chnagePassword(config: any): Observable<any> {
  return this.http.post(`${environment.apiUrl}/api/User/resetpassword`, config);
}

  // PUT: Update an existing User by ID
  updateUser(id: number, config: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/api/User/${id}`,
      config
    );
  }

  // DELETE: Delete an Users by ID
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/User/${id}`);
  }

  

}
