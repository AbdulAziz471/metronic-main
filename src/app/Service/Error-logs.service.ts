import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserQueryParams } from '../pages/LoginAudit/LoginAudit/login-audit.modal';
@Injectable({
    providedIn: 'root'
  })
  export class ErrorLogsService {
  
    private apiUrl = `${environment.apiUrl}/api/NLog`;
  
    constructor(private http: HttpClient) { }
  
    getAllErrorLogs(
        userName: string,
        skip: number,
        pageSize: number,
        searchQuery: string,
        orderBy: string,
        fields: string
      ): Observable<any> {
        let params = new HttpParams()
          .set('UserName', userName)
          .set('Skip', skip)
          .set('PageSize', pageSize)
          .set('SearchQuery', searchQuery)
          .set('OrderBy', orderBy)
          .set('Fields', fields);
    
        return this.http.get(this.apiUrl, { params });
      }
    
  }
  