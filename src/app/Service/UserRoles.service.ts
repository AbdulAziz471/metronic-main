import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserRolesService {
  constructor(private http: HttpClient) { }
     getUserRoles(id: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/RoleUsers/${id}`);
    
  }

  // New method for updating users' roles
  updateUsersRoles(roleId: string, userIds: string[]): Observable<any> {
    const payload = {
      roleId: roleId, // Role ID
      userIds: userIds // Array of user IDs
    };
  
    return this.http.put(`${environment.apiUrl}/api/RoleUsers/${roleId}`, payload);
  }
}
