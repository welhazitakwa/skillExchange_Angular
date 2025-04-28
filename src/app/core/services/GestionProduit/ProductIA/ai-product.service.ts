import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiProductService {

  private apiUrl = 'http://localhost:8084/skillExchange/api/ai'; 

  constructor(private http: HttpClient) {}

  analyzeProduct(images: File[]): Observable<any> { 
    const formData = new FormData();
    images.forEach(file => {
      formData.append('images', file);
    });

    return this.http.post<any>(`${this.apiUrl}/analyze-product`, formData); 
  }
  analyzeReview(comment: string) {
    return this.http.post<any>(`${this.apiUrl}/analyze-review`, { comment });
  }

}
