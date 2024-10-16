import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesApiService {
  constructor(private http: HttpClient) {}

  // GET: Fetch all SMTP Settings
  getAllRoles(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/role`); 
  }

  // GET: Fetch a single SMTP Setting by ID
  getRollbyId(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/role/${id}`);
  }

  // POST: Create a new SMTP Setting
  createRole(config: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/role`, config);
  }

  // PUT: Update an existing SMTP Setting by ID
  updateRole(id: string, roleData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/Role/${id}`, roleData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // DELETE: Delete an SMTP Setting by ID
  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/Role/${id}`);
  }

  

}
