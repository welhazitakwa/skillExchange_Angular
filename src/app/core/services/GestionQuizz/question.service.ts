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

  // Fetch questions by quiz ID
  getQuestionsByQuizId(quizId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/quiz/${quizId}`).pipe(
      catchError((error) => {
        console.error('Error fetching questions:', error);
        return throwError(() => new Error('Failed to fetch questions'));
      })
    );
  }

  // Fetch all questions
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching all questions:', error);
        return throwError(() => new Error('Failed to fetch all questions'));
      })
    );
  }

  // Add a new question
  addQuestion(question: Question): Observable<Question> {
    // Include quizId as a query parameter in the URL
    const url = `${this.apiUrl}?quizId=${question.quiz.id}`;
  
    // Define the body for the request
    const requestBody = {
      question: question.question,  // backend expects 'question'
      reponse: question.reponse,    // backend expects 'reponse'
      option1: question.option1,    // backend expects 'option1'
      option2: question.option2,    // backend expects 'option2'
      option3: question.option3,    // backend expects 'option3'
      option4: question.option4,    // backend expects 'option4'
      quiz: { id: question.quiz.id }, // Include the quiz object if needed
    };
  
    // Log the request body to check if the data is correct
    console.log('Request Body:', requestBody);
    console.log('Request URL:', url);
  
    return this.http.post<Question>(url, requestBody, { observe: 'response' }).pipe(
      map((response) => {
        console.log('Full Response:', response); // Log the full response
        if (response.status === 200 && response.body) {
          return response.body; // Return the question added
        } else {
          console.error('Unexpected response format', response);
          throw new Error('Unexpected response format');
        }
      }),
      catchError((error) => {
        console.error('Error adding question:', error);
        return throwError(() => new Error('Failed to add question'));
      })
    );
  }
  
  // Edit an existing question
  editQuestion(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, question).pipe(
      catchError((error) => {
        console.error('Error editing question:', error);
        return throwError(() => new Error('Failed to edit question'));
      })
    );
  }

  // Delete a question
  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting question:', error);
        return throwError(() => new Error('Failed to delete question'));
      })
    );
  }
}
