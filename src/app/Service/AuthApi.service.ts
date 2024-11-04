import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';
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
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  clearSession(): void {
    localStorage.removeItem('accessToken');
  }
  getClaims(): any {
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  hasClaim(claimType: string | string[]): boolean {
    const claims = this.getClaims();
    if (!claims) return false;

    if (Array.isArray(claimType)) {
      return claimType.some(claim => claims.hasOwnProperty(claim) && claims[claim] === 'true');
    } else {
      return claims.hasOwnProperty(claimType) && claims[claimType] === 'true';
    }
  }
}