import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/GestionUser/User';

@Injectable({
  providedIn: 'root'
})
export class EmojiPostsService {
  private baseUrl = 'http://localhost:8084/skillExchange/emojiPosts'; 
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
});

  constructor(private http: HttpClient) {}

  addReaction(reaction: { postId: number/*, userId: number,*/ ,email:string, emoji: string }): Observable<any> {
    return this.http.post("http://localhost:8084/skillExchange/posts/react", reaction, { headers: this.headers });
  }


  getEmojiCounts(postId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`http://localhost:8084/skillExchange/emojiPosts/counts/${postId}`);
  }
  getUsersByEmojiAndPostId(postId: number, emoji: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/${postId}/${emoji}`);
  }
  hasUserReactedWithEmoji(postId: number, userEmail: string, emoji: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/${postId}/users/${userEmail}/${emoji}`);
  }
  
  removeReaction(postId: number, userEmail: string, emoji: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${postId}/users/${userEmail}/${emoji}`);
  }
  

  // getUserReaction(postId: number, userId: number): Observable<string | null> {
  //   return this.http.get<string | null>(`${this.baseUrl}/user-reaction?postId=${postId}&userId=${userId}`);
  // }
}
