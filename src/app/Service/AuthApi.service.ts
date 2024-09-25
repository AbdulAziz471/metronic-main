import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  login(userName: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/user/login`, { userName, password }).pipe(
      map((response: any) => {
        localStorage.setItem('accessToken', response.bearerToken); 
        return response;
      })
    );
  }
}