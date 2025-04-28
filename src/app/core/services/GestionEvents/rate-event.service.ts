import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RateEvent } from '../../models/GestionEvents/rate-event';

@Injectable({
  providedIn: 'root'
})
export class RateEventService {
  private baseUrl = 'http://localhost:8084/skillExchange/eventRate';

  constructor(private http: HttpClient) { }

  getRatesByEventId(eventId: number): Observable<RateEvent[]> {
    return this.http.get<RateEvent[]>(`${this.baseUrl}/retrieveRateEventsByEvent/${eventId}`).pipe(
      tap(data => console.log('Fetched rates:', data)),
      catchError(this.handleError)
    );
  }

  getRateByUserAndEvent(userId: number, eventId: number): Observable<RateEvent | null> {
    return this.http.get<RateEvent>(
      `${this.baseUrl}/retrieveRateEventByUserAndEvent?userId=${userId}&eventId=${eventId}`
    ).pipe(
      tap(data => console.log('Fetched user rate:', data)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Cas normal : aucun rating trouvé
          console.warn('No rating found for this user and event.');
          return new Observable<null>(observer => {
            observer.next(null);
            observer.complete();
          });
        }
        console.error('Error fetching rate event by user and event:', error);
        return throwError(() => new Error('Failed to fetch user rate; endpoint may not be implemented.'));
      })
    );
  }
  

  addRate(rate: RateEvent): Observable<RateEvent> {
    return this.http.post<RateEvent>(`${this.baseUrl}/add-RateEvent`, rate).pipe(
      tap(data => console.log('Added rate:', data)),
      catchError(this.handleError)
    );
  }

  updateRate(rate: RateEvent): Observable<RateEvent> {
    return this.http.patch<RateEvent>(`${this.baseUrl}/modify-RateEvent`, rate).pipe(
      tap(data => console.log('Updated rate:', data)),
      catchError(this.handleError)
    );
  }

  deleteRate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/removeRateEvent/${id}`).pipe(
      tap(() => console.log('Deleted rate:', id)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status} ${error.message}`;
      if (error.error && typeof error.error === 'string') {
        errorMessage += `; Details: ${error.error}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}