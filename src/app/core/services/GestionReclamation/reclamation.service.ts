import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Reclamation } from '../../models/GestionReclamation/Reclamation';

@Injectable({
  providedIn: 'root',
})
export class ReclamationService {
  url = 'http://localhost:8084/skillExchange/reclamation';
  private headers = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  });

  constructor(private http: HttpClient) {}

  getAllReclamations(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.url, { 
      headers: this.headers 
    });
  }

  getReclamationById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.url}/${id}`, { 
      headers: this.headers 
    });
  }

  addReclamation(reclamation: Reclamation): Observable<any> {
    return this.http.post<Reclamation>(this.url, reclamation, { headers: this.headers });
  }

  deleteReclamations(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.headers
    });
  }

  updateReclamations(id: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.url}/${id}`, reclamation, {
      headers: this.headers
    }).pipe(
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }

  sendWhatsAppMessage(message: string): Observable<any> {
    return this.http.post(`${this.url}/send-whatsapp`, { message }, { 
      headers: this.headers,
      responseType: 'json'
    }).pipe(
      catchError(error => {
        console.error('WhatsApp API Error:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to send notification',
          details: error.statusText
        }));
      })
    );
  }

}
