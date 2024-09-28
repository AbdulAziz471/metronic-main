import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditRoleService {
  constructor(private http: HttpClient) { }

  // GET: Fetch all app actions
  getAllPages(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/pages`);
  }
 // GET: Fetch all app actions
 getAllActions(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/actions`);
  }
 // GET: Fetch all app actions
 getAllPagesActions(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/pageactions`);
  }

 
}
