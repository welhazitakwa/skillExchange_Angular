import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Video } from '../../models/GestionFormation/video';

@Injectable({
  providedIn: 'root',
})
export class YouTubeServiceService {
  private apiUrl = 'http://localhost:8084/skillExchange/api/youtube';

  constructor(private http: HttpClient) {}

  getVideos(query: string): Observable<Video[]> {
    return this.http
      .get<Video[]>(`${this.apiUrl}/videos?query=${encodeURIComponent(query)}`)
      .pipe(catchError(() => of([])));
  }
}
