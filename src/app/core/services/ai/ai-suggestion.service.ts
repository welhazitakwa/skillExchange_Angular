import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiSuggestionService {
  private apiUrl = 'http://localhost:8084/skillExchange/ai/suggestions';

  constructor(private http: HttpClient) { }

  getSuggestions(text: string) {
    return this.http.post(this.apiUrl, text, { responseType: 'text' }).pipe(
      map(response => {
        try {
          return JSON.parse(response); // Attempt to parse JSON
        } catch (e) {
          // Handle non-JSON error responses from backend
          return { error: response || 'Unknown error occurred' };
        }
      }),
      catchError(error => {
        // Handle HTTP errors (e.g., status 0)
        return throwError(() => 'Failed to connect to the server. Check your network.');
      })
    );
  }
}