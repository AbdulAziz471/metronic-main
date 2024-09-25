import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  // Static token for testing purposes
  private staticToken: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YjM1MmIzNy0zMzJhLTQwYzYtYWIwNS1lMzhmY2YxMDk3MTkiLCJFbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsIm5iZiI6MTcyNzE1Nzc2NywiZXhwIjoxNzI3MjAwOTY3LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJQVENVc2VycyJ9.1zgzK_Wt1W8vx0S-566eIdj5pxrZzV_R7askJzpBNTs";

  // Helper method to create headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.staticToken}`
    });
  }

  getActiveUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Dashboard/GetActiveUserCount`, { headers: this.getHeaders() });
  }

  getInactiveUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Dashboard/GetInactiveUserCount`, { headers: this.getHeaders() });
  }

  getTotalUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Dashboard/GetTotalUserCount`, { headers: this.getHeaders() });
  }

  getOnlineUsers(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/Dashboard/GetOnlineUsers`, { headers: this.getHeaders() });
  }

  getrecentlyRegisteredUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/User/GetRecentlyRegisteredUsers`, { headers: this.getHeaders() });
  }
}
