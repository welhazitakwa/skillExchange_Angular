import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmojiPostsService {
  private baseUrl = 'http://localhost:8080/emojiPosts'; // adapte le port si nécessaire
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
});

  constructor(private http: HttpClient) {}

  addReaction(reaction: { postId: number/*, userId: number,*/ ,email:String, emoji: string }): Observable<any> {
    return this.http.post(`http://localhost:8080/posts/react`, reaction, { headers: this.headers });
  }


  getEmojiCounts(postId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/counts/${postId}`);
  }

  getUserReaction(postId: number, userId: number): Observable<string | null> {
    return this.http.get<string | null>(`${this.baseUrl}/user-reaction?postId=${postId}&userId=${userId}`);
  }
}
