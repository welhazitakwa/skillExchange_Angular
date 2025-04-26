import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  private participationCourseId?: number; 
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
    return this.http.post<UserAnswer>(
      `${this.apiUrl}/${quizId}/answers`,
      {
        ...userAnswer,
        participationCourse: { idp: this.participationCourseId } // Add this
      }
    );
  }

  submitResult(
    quizId: number, 
    participationId: number,
    userAnswers: UserAnswer[]
  ): Observable<Result> {
    return this.http.post<Result>(
      `${this.apiUrl}/${quizId}/results`,
      userAnswers.map(answer => ({
        question: { id: answer.question.id },
        userAnswer: answer.userAnswer
      })),
      {
        params: { participationCourseId: participationId.toString() }
      }
    );
  }



  affectCourse(quizId: number, courseid: number): Observable<Result> {
    return this.http.post<Result>(`${this.apiUrl}/${quizId}/course/${courseid}`, null);
  }
  
  getquizbycourse( courseid: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/course/${courseid}`);
  }
  getQuizWithQuestions(id: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.apiUrl}/${id}`);
  }
  generateQuizImage(title: string): Observable<string> {
    const params = new HttpParams().set('title', title);
    return this.http.post('/generate-quiz-image', null, {
      params,
      responseType: 'text',
    });
  }
}
