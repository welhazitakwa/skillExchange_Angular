// email.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailUrl = 'http://localhost:8084/skillExchange/email/send'; // Use existing endpoint
  private headers = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  });

  constructor(private http: HttpClient) {}

  sendConfirmationEmail(emailData: EmailRequest): Observable<any> {
    return this.http.post(this.emailUrl, emailData, { 
        headers: this.headers,
        responseType: 'text'
     });
  }
  
  sendResolutionEmail(emailData: EmailRequest): Observable<any> {
    return this.http.post(this.emailUrl, emailData, { 
      headers: this.headers,
      responseType: 'text'
    });
  }
}

export interface EmailRequest {
  to: string;
  subject: string;
  text: string;
}