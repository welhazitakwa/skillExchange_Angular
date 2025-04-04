import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParticipationEvents } from '../../models/GestionEvents/participation-events';

@Injectable({
  providedIn: 'root'
})
export class ParticipationEventsService {
  private url = 'http://localhost:8084/skillExchange/participations';

  constructor(private http: HttpClient) { }

  getParticipations(): Observable<ParticipationEvents[]> {
    return this.http.get<ParticipationEvents[]>(this.url);
  }

  addParticipation(participation: ParticipationEvents): Observable<ParticipationEvents> {
    return this.http.post<ParticipationEvents>(this.url, participation);
  }

  deleteParticipation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getParticipationByID(id: number): Observable<ParticipationEvents> {
    return this.http.get<ParticipationEvents>(`${this.url}/${id}`);
  }

  updateParticipation(participation: ParticipationEvents): Observable<ParticipationEvents> {
    return this.http.put<ParticipationEvents>(`${this.url}/${participation.idparticipant}`, participation);
  }
}
