import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiUrl = 'http://localhost:8084/skillExchange/ai';

  constructor(private http: HttpClient) {}

//   analyzeTitles(titles: string[]): Observable<any> {
//     return this.http.post(`${this.apiUrl}/analyze`, { titles });
//   }
// analyzeTitles(titles: string[]): Observable<{ [key: string]: number }> {
//     return this.http.post<{ [key: string]: number }>(`${this.apiUrl}/analyze-titles`, titles).pipe(
//       catchError(error => {
//         console.error('AI Analysis Error:', error);
//         return throwError(() => new Error('Failed to analyze titles'));
//       })
//     );
//   }

analyzeTitles(titles: string[]): Observable<{ [key: string]: number }> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  
    return this.http.post<{ [key: string]: number }>(
      `${this.apiUrl}/analyze-titles`,
      titles,
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Full error object:', error);
        let message = 'Failed to analyze titles';
        
        if (error.status === 401) {
          message = 'Authentication required - Please login first';
        } else if (error.error?.message) {
          message = error.error.message;
        }
        
        return throwError(() => new Error(message));
      })
    );
  }
}