import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventComment } from '../../models/GestionEvents/event-comment';

@Injectable({
  providedIn: 'root'
})
export class EventCommentService {
  private url = 'http://localhost:8084/skillExchange/eventComments';

  constructor(private http: HttpClient) { }

  getComments(): Observable<EventComment[]> {
    return this.http.get<EventComment[]>(this.url);
  }

  addComment(comment: EventComment): Observable<EventComment> {
    return this.http.post<EventComment>(this.url, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getCommentByID(id: number): Observable<EventComment> {
    return this.http.get<EventComment>(`${this.url}/${id}`);
  }

  updateComment(comment: EventComment): Observable<EventComment> {
    return this.http.put<EventComment>(`${this.url}/${comment.idComment}`, comment);
  }
}
