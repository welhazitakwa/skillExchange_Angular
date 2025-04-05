import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RateEvent } from '../../models/GestionEvents/rate-event';

@Injectable({
  providedIn: 'root'
})
export class RateEventService {
  private url = 'http://localhost:8084/skillExchange/rateEvents';

  constructor(private http: HttpClient) { }

  getRates(): Observable<RateEvent[]> {
    return this.http.get<RateEvent[]>(this.url);
  }

  addRate(rate: RateEvent): Observable<RateEvent> {
    return this.http.post<RateEvent>(this.url, rate);
  }

  deleteRate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getRateByID(id: number): Observable<RateEvent> {
    return this.http.get<RateEvent>(`${this.url}/${id}`);
  }

  updateRate(rate: RateEvent): Observable<RateEvent> {
    return this.http.put<RateEvent>(`${this.url}/${rate.idRate}`, rate);
  }
}
