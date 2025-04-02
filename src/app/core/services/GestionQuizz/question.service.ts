import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Question } from 'src/app/core/models/QuestionQuizz/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:8084/skillExchange/api/questions';

  constructor(private http: HttpClient) {}

  getQuestionsByQuizId(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/quiz/${quizId}`);
  }

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl);
  }

  addQuestion(question: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, question, { observe: 'response' }).pipe(
      map(response => {
        console.log("Full Response:", response);
        if (response.status === 200 && response.body) {
          return response.body; // ✅ Ensure Angular correctly processes the response
        } else {
          throw new Error('Unexpected response format');
        }
      }),
      catchError(error => {
        console.error('Error adding question:', error);
        return throwError(() => new Error('Failed to add question'));
      })
    );
  }
  editQuestion(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, question);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
