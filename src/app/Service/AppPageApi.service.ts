import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppPageApiService {
  constructor(private http: HttpClient) { }

  // GET: Fetch all app actions
  getAllAppPage(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Pages`);
  }

  // POST: Create a new app action
  createAppPage(data: { name: string; url: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/page/`, data);
  }

  // DELETE: Delete an app action by ID
  deleteAppPage(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/Pages/${id}`);
  }

  // PUT: Update an existing app action
  updateAppPage(action: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/Pages/${action.id}`, action);
  }
}
