import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Badge } from '../../models/GestionUser/Badge';

@Injectable({
  providedIn: 'root',
})
export class BadgeService {
  url = 'http://localhost:8084/skillExchange/badges';
  private headers = new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  });

  constructor(private http: HttpClient) {}

  getAllBadges(): Observable<any> {
    return this.http.get<Badge[]>(this.url, { headers: this.headers });
  }

  addBadge(badge: Badge): Observable<any> {
    return this.http.post<Badge>(this.url, badge, { headers: this.headers });
  }

  deleteBadge(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, {
      headers: this.headers,
    });
  }

  updateBadge(id: number, badge: Badge): Observable<Badge> {
    return this.http.patch<Badge>(`${this.url}/${id}`, badge);
  }
}
