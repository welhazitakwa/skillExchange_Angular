import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from 'src/app/core/models/QuestionQuizz/quiz';
import { UserAnswer } from 'src/app/core/models/QuestionQuizz/userAnswer';
import { Result } from 'src/app/core/models/QuestionQuizz/result';
import { Question } from 'src/app/core/models/QuestionQuizz/question'; // Add Question import


@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = 'http://localhost:8084/skillExchange/api/quizzes';

  constructor(private http: HttpClient) {}

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(this.apiUrl);
  }
  getQuizById(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }
  
  // Use FormData here
  createQuiz(quiz: FormData): Observable<Quiz> {
    return this.http.post<Quiz>(this.apiUrl, quiz);
  }
  getQuizQuestions(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(
      `http://localhost:8084/skillExchange/api/questions/quiz/${quizId}`
    );
  }
  // Use FormData here
  updateQuiz(id: number, quiz: FormData): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.apiUrl}/${id}`, quiz);
  }
  
  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  submitAnswer(quizId: number, userAnswer: UserAnswer): Observable<UserAnswer> {
    return this.http.post<UserAnswer>(`${this.apiUrl}/${quizId}/answers`, userAnswer);
  }

  // Submit the final result for the quiz
  submitResult(quizId: number, participationCourseId: number): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/${quizId}/results`, null, {
      params: { participationCourseId: participationCourseId.toString() },
    });
  }
}
