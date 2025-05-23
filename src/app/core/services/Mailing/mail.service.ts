import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  url = 'http://localhost:8084/skillExchange/email';

  constructor(private http: HttpClient) {}

  sendEmail(email: string, subject: string, text: string) {
    return this.http.post(`${this.url}/send`, {
      to: email,
      subject: subject,
      text: text,
    });
  }

  sendPasswordResetCode(email: string, code: string) {
    return this.http.post(`${this.url}/send-reset-code`, {
      email: email,
      code: code,
    });
  }

  sendVerificationCode(email: string, code: string) {
    return this.http.post(`${this.url}/send-verification-code`, {
      email: email,
      code: code,
    });
  }

  sendEventConfirmationEmail(email: string, userName: string, eventName: string, startDate: string, endDate: string, place: string, status: string, eventId: number) {
    return this.http.post(`${this.url}/send-event-confirmation`, {
      to: email,
      userName,
      eventName,
      startDate,
      endDate,
      place,
      status,
      eventId
    });
  }
}