import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailSettingService {
  constructor(private http: HttpClient) {}

  // POST: Create a new SMTP Setting
  SendEmail (config: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/email`, config);
  }

  // GET: Fetch all SMTP Settings
  getAllSMTPSettings(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/EmailSMTPSetting`);
  }

  // GET: Fetch a single SMTP Setting by ID
  getSMTPSettingById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/EmailSMTPSetting/${id}`);
  }

  // POST: Create a new SMTP Setting
  createSMTPSetting(config: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/EmailSMTPSetting`, config);
  }

  // PUT: Update an existing SMTP Setting by ID
  updateSMTPSetting(id: number, config: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/api/EmailSMTPSetting/${id}`,
      config
    );
  }

  // DELETE: Delete an SMTP Setting by ID
  deleteSMTPSetting(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/EmailSMTPSetting/${id}`);
  }

  // GET: Fetch all Email Temaplete  Settings
  getAllEmailTemplate(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/EmailTemplate`);
  }

  // GET: Fetch a single Email Temaplete  Setting by ID
  getEmailTemplateById(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/api/EmailTemplate/${id}`);
  }

  // POST: Create a new Email Temaplete  Setting
  createEmailTemplate(config: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/EmailTemplate`, config);
  }

  // PUT: Update an existing Email Temaplete  Setting by ID
  updateEmailTemplate(id: number, config: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/api/emailTemplate/${id}`,
      config
    );
  }

  // DELETE: Delete an Email Temaplete  Setting by ID
  deleteEmailTemplate(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/api/EmailTemplate/${id}`);
  }
}
