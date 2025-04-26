import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Question } from 'src/app/core/models/QuestionQuizz/question';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private apiUrl = 'http://localhost:8084/skillExchange/api/questions';

  constructor(private http: HttpClient) {}

  getQuestionsByQuizId(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`http://localhost:8084/skillExchange/api/questions/quiz/${quizId}`);
  }
  

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching all questions:', error);
        return throwError(() => new Error('Failed to fetch all questions'));
      })
    );
  }

  addQuestion(question: Question): Observable<Question> {
    const requestBody = {
      quizId: question.quiz.id,
      question: {
        question: question.question,
        reponse: question.reponse,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4
      }
    };

    return this.http.post<Question>(this.apiUrl, requestBody).pipe(
      map((response) => response),
      catchError((error) => {
        console.error('Error adding question:', error);
        return throwError(() => new Error('Failed to add question'));
      })
    );
  }

  editQuestion(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, question).pipe(
      catchError((error) => {
        console.error('Error editing question:', error);
        return throwError(() => new Error('Failed to edit question'));
      })
    );
  }

  deleteQuestion(id: number): Observable<string> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        // Handle the message here
        return response.message;  // Extract the message from the response
      }),
      catchError((error) => {
        console.error('Error deleting question:', error);
        return throwError(() => new Error('Failed to delete question'));
      })
    );
  }
  getAiSuggestions(title: string): Observable<Question[]> {
    return this.http.get<Question[]>(`/api/ai/suggest-question${encodeURIComponent(title)}`);
  }
  getQuestionHint(questionId: number): Observable<{hint: string}> {
 
    return this.http.get<{hint: string}>(
      `${this.apiUrl}/hint/${questionId}`  
    );
  }
  
}
