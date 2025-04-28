import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MixPanelAnalyticsService {

  private apiUrl = 'http://localhost:8084/skillExchange'; // URL de votre backend Spring Boot

  constructor(private http: HttpClient) {}

  getEventData(eventName: string, startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('event', eventName)
      .set('from_date', startDate)
      .set('to_date', endDate);

    return this.http.get(`${this.apiUrl}/api/mixpanel/events`, { params });
  }
}