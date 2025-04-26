import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Events } from '../../models/GestionEvents/events';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private url = 'http://localhost:8084/skillExchange/events';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.url}/retrieve-Events`).pipe(
      catchError(error => {
        console.error('Error fetching Events:', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );

  }
  

  addEvent(event: Events): Observable<Events> {
    return this.http.post<Events>(`${this.url}/add-Event`, event);  
  }

   // Pour supprimer un événement (corrigé)
   deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/removeEvent/${id}`); // Utilise la route /removeEvent/{Event-id}
  }

  // Pour obtenir un événement par son ID
  getEventByID(id: number): Observable<Events> {
    return this.http.get<Events>(`${this.url}/retrieveEvents/${id}`); // Utilise la route /retrieveEvents/{Event-id}
  }

  // Pour mettre à jour un événement (corrigé)
  updateEvent(event: Events): Observable<Events> {
    return this.http.patch<Events>(`${this.url}/modify-Event`, event); // Utilise la route /modify-Event
  }
}