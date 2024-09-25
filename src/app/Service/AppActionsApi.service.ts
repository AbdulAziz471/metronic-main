import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppActionService {
  constructor(private http: HttpClient) { }

  // GET: Fetch all app actions
  getAllAppAction(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Actions`);
  }

  // POST: Create a new app action
  createAppAction(actionName: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/Action`, { name: actionName });
  }

  // DELETE: Delete an app action by ID
  deleteAppAction(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/Action/${id}`);
  }

  // PUT: Update an existing app action
  updateAppAction(action: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/api/Action/${action.id}`, action);
  }
}
