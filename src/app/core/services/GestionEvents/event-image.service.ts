import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventImage } from '../../models/GestionEvents/event-image';

@Injectable({
  providedIn: 'root'
})
export class EventImageService {
  private url = 'http://localhost:8084/skillExchange/eventImages';

  constructor(private http: HttpClient) { }

  getImages(): Observable<EventImage[]> {
    return this.http.get<EventImage[]>(this.url);
  }

  addImage(image: EventImage): Observable<EventImage> {
    return this.http.post<EventImage>(this.url, image);
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getImageByID(id: number): Observable<EventImage> {
    return this.http.get<EventImage>(`${this.url}/${id}`);
  }

  updateImage(image: EventImage): Observable<EventImage> {
    return this.http.put<EventImage>(`${this.url}/${image.idImage}`, image);
  }
}
