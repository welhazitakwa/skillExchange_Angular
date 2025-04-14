import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { EventComment } from '../../models/GestionEvents/event-comment';

@Injectable({
  providedIn: 'root'
})
export class EventCommentService {
  private url = 'http://localhost:8084/skillExchange/api/eventComments';

  constructor(private http: HttpClient) { }

  getComments(): Observable<EventComment[]> {
    return this.http.get<EventComment[]>(this.url);
  }

   

  addComment(commentData: any): Observable<any> {
    const payload = {
      content: commentData.content,
      email: commentData.email,
      eventId: commentData.event.idEvent,
      ...(commentData.parentComment && { parentCommentId: commentData.parentComment.idComment })
    };
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    return this.http.post<any>(this.url, payload, { headers }).pipe(
      map(response => {
        // Convertir la réponse en objet EventComment
        return {
          idComment: response.idComment,
          content: response.content,
          email: response.email,
          date: new Date(response.date),
          event: commentData.event,
          ...(commentData.parentComment && { parentComment: commentData.parentComment })
        } as EventComment;
      }),
      catchError(error => {
        console.error('Error adding comment:', error);
        return throwError(() => new Error('Failed to add comment: ' + error.message));
      })
    );
  }


  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getCommentByID(id: number): Observable<EventComment> {
    return this.http.get<EventComment>(`${this.url}/${id}`);
  }

  getCommentsByEvent(eventId: number): Observable<EventComment[]> {
    return this.http.get<EventComment[]>(`${this.url}/event/${eventId}`).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        return throwError(() => new Error('Failed to load comments'));
      })
    );
  }
updateComment(comment: Partial<EventComment>): Observable<EventComment> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.put<EventComment>(
    `${this.url}/${comment.idComment}`, 
    { content: comment.content },
    { headers }
  ).pipe(
    catchError(error => {
      console.error('Error updating comment:', error);
      return throwError(() => new Error('Failed to update comment'));
    })
  );
}
}