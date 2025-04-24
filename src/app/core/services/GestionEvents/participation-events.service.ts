import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ParticipationEvents } from '../../models/GestionEvents/participation-events';
import { Status } from '../../models/GestionEvents/status';

@Injectable({
  providedIn: 'root'
})
export class ParticipationEventsService {
  private url = 'http://localhost:8084/skillExchange/participationEvents';

  constructor(private http: HttpClient) { }

  getParticipations(): Observable<ParticipationEvents[]> {
    return this.http.get<ParticipationEvents[]>(this.url);
  }

  addParticipation(participation: ParticipationEvents): Observable<ParticipationEvents> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
    return this.http.post<ParticipationEvents>(`${this.url}/add-ParticipationEvents`, participation, { headers });
  }

  deleteParticipation(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
    return this.http.delete<void>(`${this.url}/removeParticipationEvents/${id}`, { headers });
  }

  getParticipationByID(id: number): Observable<ParticipationEvents> {
    return this.http.get<ParticipationEvents>(`${this.url}/retrieveParticipationEvents/${id}`);
  }

  updateParticipation(participation: ParticipationEvents): Observable<ParticipationEvents> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
    return this.http.put<ParticipationEvents>(`${this.url}/${participation.idparticipant}`, participation, { headers });
  }

  participateInEvent(eventId: number, status: Status): Observable<ParticipationEvents | null> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
    return this.http.post<ParticipationEvents | null>(
      `${this.url}/participate/${eventId}/${status}`,
      {},
      { headers }
    );
  }

  getParticipationsByUserEmail(email: string): Observable<ParticipationEvents[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
    return this.http.get<ParticipationEvents[]>(`${this.url}/user/${email}`, { headers }).pipe(
      tap(response => console.log('getParticipationsByUserEmail response:', response))
    );
  }

  countByEventAndStatus(eventId: number, status: string): Observable<number> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
    return this.http.get<number>(`${this.url}/countByEventAndStatus/${eventId}/${status}`, { headers }).pipe(
      tap(response => console.log(`countByEventAndStatus response for eventId=${eventId}, status=${status}:`, response))
    );
  }

  getParticipationByUserAndEvent(email: string, eventId: number): Observable<ParticipationEvents | null> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    });
    return this.http.get<ParticipationEvents | null>(
        `${this.url}/user/${email}/event/${eventId}`,
        { headers }
    );
}

getParticipationsByUserEmail2(email: string): Observable<ParticipationEvents[]> {
  console.log('ParticipationEventsService: Fetching participations for email:', email);
  const token = localStorage.getItem('token');
  console.log('ParticipationEventsService: JWT token:', token);
  const headers = new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
  });
  return this.http.get<ParticipationEvents[]>(`${this.url}/user/${email}`, { headers }).pipe(
      tap(response => console.log('ParticipationEventsService: Participations response:', response)),
      catchError(error => {
          console.error('ParticipationEventsService: Error fetching participations:', error);
          return throwError(error);
      })
  );
}
}