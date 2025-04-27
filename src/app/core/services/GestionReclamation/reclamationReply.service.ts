import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReclamationReply } from '../../models/GestionReclamation/ReclamationReply';

@Injectable({
  providedIn: 'root',
})
export class ReclamationReplyService {
  url = 'http://localhost:8084/skillExchange/reply';
  private headers = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  });

  constructor(private http: HttpClient) {}

  getAllReclamationReply(): Observable<any> {
    return this.http.get<ReclamationReply[]>(this.url, { headers: this.headers });
  }

  addReclamationReply(reclamationReply: ReclamationReply): Observable<any> {
    return this.http.post<ReclamationReply>(this.url, reclamationReply, { headers: this.headers });
  }

  deleteReclamationReply(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.headers,
    });
  }

  updateReclamationReply(id: number, reclamationReply: ReclamationReply): Observable<ReclamationReply> {
    return this.http.patch<ReclamationReply>(`${this.url}/${id}`, reclamationReply);
  }

  getRepliesByReclamation(id: number): Observable<ReclamationReply[]> {
    return this.http.get<ReclamationReply[]>(`${this.url}/reclamation/${id}`, { 
      headers: this.headers 
    });
  }
}
