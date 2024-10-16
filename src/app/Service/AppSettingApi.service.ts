import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppSettingService {
  constructor(private http: HttpClient) { }

  // GET: Fetch all app settings
  getAllAppSettings(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/AppSetting`);
  }
  createAppSetting(setting: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/AppSetting`, setting);
  }
//   getAppSettingById(id: number): Observable<any> {
//     return this.http.get(`${environment.apiUrl}/api/AppSetting/${id}`);
//   }

//   getAppSettingByKey(key: string): Observable<any> {
//     return this.http.get(`${environment.apiUrl}/api/AppSetting/key/${key}`);
//   }

 
  // PUT: Update an existing Email Temaplete  Setting by ID
  updateAppSetting(id: number, config: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/api/AppSetting/${id}`,
      config
    );
  }
  // updateAppSetting(setting: any): Observable<any> {
  //   return this.http.put(`${environment.apiUrl}/api/AppSetting/${setting.id}`, setting);
  // }

  deleteAppSetting(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/AppSetting/${id}`);
  }
}
