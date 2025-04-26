import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventImage } from '../../models/GestionEvents/event-image';

@Injectable({
  providedIn: 'root'
})
export class EventImageService {
  private baseUrl = 'http://localhost:8084/skillExchange/eventImage';

  constructor(private http: HttpClient) { }

  getAllImages(): Observable<EventImage[]> {
    return this.http.get<EventImage[]>(`${this.baseUrl}/retrieve-EventImage`);
  }

  getImagesByEventId(eventId: number): Observable<EventImage[]> {
    return this.http.get<EventImage[]>(`${this.baseUrl}/byEvent/${eventId}`);
  }

  getImageById(id: number): Observable<EventImage> {
    return this.http.get<EventImage>(`${this.baseUrl}/retrieveEventImage/${id}`);
  }

  addImage(eventImage: EventImage): Observable<EventImage> {
    return this.http.post<EventImage>(`${this.baseUrl}/add-EventImage`, eventImage);
  }

  updateImage(eventImage: EventImage): Observable<EventImage> {
    return this.http.patch<EventImage>(`${this.baseUrl}/modify-EventImage`, eventImage);
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/removeEventImage/${id}`);
  }

}