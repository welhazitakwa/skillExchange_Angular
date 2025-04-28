import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Events } from '../../models/GestionEvents/events';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private url = 'http://localhost:8084/skillExchange/events';
  private participationUrl = 'http://localhost:8084/skillExchange/participationEvents';
  private aiUrl = 'http://localhost:8000';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  getEvents(): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.url}/retrieve-Events`).pipe(
      catchError(error => {
        console.error('Error fetching Events:', error);
        this.snackBar.open('Failed to load events.', 'Close', { duration: 5000 });
        return of([]);
      })
    );
  }

  addEvent(event: Events): Observable<Events> {
    return this.http.post<Events>(`${this.url}/add-Event`, event).pipe(
      catchError(error => {
        console.error('Error adding event:', error);
        this.snackBar.open('Failed to add event.', 'Close', { duration: 5000 });
        throw error;
      })
    );
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/removeEvent/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting event:', error);
        this.snackBar.open('Failed to delete event.', 'Close', { duration: 5000 });
        throw error;
      })
    );
  }

  getEventByID(id: number): Observable<Events> {
    return this.http.get<Events>(`${this.url}/retrieveEvents/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching event:', error);
        this.snackBar.open('Failed to load event.', 'Close', { duration: 5000 });
        throw error;
      })
    );
  }

  updateEvent(event: Events): Observable<Events> {
    return this.http.patch<Events>(`${this.url}/modify-Event`, event).pipe(
      catchError(error => {
        console.error('Error updating event:', error);
        this.snackBar.open('Failed to update event.', 'Close', { duration: 5000 });
        throw error;
      })
    );
  }

  getUserHistory(email: string): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.participationUrl}/user/${email}/history`).pipe(
      catchError(error => {
        console.error('Error fetching user history:', error);
        if (error.status === 401) {
          this.snackBar.open('Session expired. Please log in again.', 'Close', { duration: 5000 });
          this.router.navigate(['/login']);
        } else {
          this.snackBar.open('Failed to load user history.', 'Close', { duration: 5000 });
        }
        return of([]);
      })
    );
  }

  getRecommendedEvents(allEvents: Events[], userEvents: Events[]): Observable<number[]> {
    const payload = {
      allEvents,
      userEvents
    };
    return this.http.post<{ recommendedEvents: number[] }>(`${this.aiUrl}/recommend`, payload).pipe(
      map(response => response.recommendedEvents),
      catchError(error => {
        console.error('Error fetching recommended events:', error);
        this.snackBar.open('Failed to load recommended events.', 'Close', { duration: 5000 });
        return of([]);
      })
    );
  }

  generateImage(prompt: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.url}/generate-image`, { prompt }, { headers });
  }
}