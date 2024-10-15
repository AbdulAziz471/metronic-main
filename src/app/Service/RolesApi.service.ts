import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesApiService {
  constructor(private http: HttpClient) {}

  // GET: Fetch all SMTP Settings
  getAllRoles(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Role`); 
  }

  // GET: Fetch a single SMTP Setting by ID
  getRollbyId(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Role/${id}`);
  }

  // POST: Create a new SMTP Setting
  createRole(config: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Role`, config);
  }

  // PUT: Update an existing SMTP Setting by ID
  updateRole(id: string, config: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/api/Role/${id}`,
      config
    );
  }

  // DELETE: Delete an SMTP Setting by ID
  deleteRole(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/Role/${id}`);
  }

  

}
