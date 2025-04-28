import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface OllamaResponse {
  response: string;
}
@Injectable({
  providedIn: 'root'
})

export class OllamaService {
private apiUrl = 'http://localhost:8084/skillExchange/api/ollama/generate';

    constructor(private http: HttpClient) {}

    generateCourse(prompt: string): Observable<OllamaResponse> {
        return this.http.post<OllamaResponse>(this.apiUrl, prompt, {
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}
