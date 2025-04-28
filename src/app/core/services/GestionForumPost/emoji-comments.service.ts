import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/GestionUser/User';

@Injectable({
  providedIn: 'root'
})
export class EmojiCommentsService {

  private emojiCommentsUrl = 'http://localhost:8084/skillExchange/emojiComments';

  constructor(private http: HttpClient) {}

 
  // addReactionToComment(reaction: { commentId: number, email: string, emoji: string }): Observable<any> {
  //   return this.http.post(`${this.commentPostUrl}/reactCom`, reaction);
  // }
  addReactionToComment(reaction: { commentId: number, email: string, emoji: string }): Observable<any> {
   
    return this.http.post("http://localhost:8084/skillExchange/commentPosts/reactCom",reaction);
  }

  // ✅ Vérifie si un utilisateur a réagi avec un emoji spécifique
  hasUserReactedWithEmojiForComment(commentId: number, email: string, emoji: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.emojiCommentsUrl}/${commentId}/users/${email}/${emoji}`);
  }

  // ✅ Supprime une réaction
  removeReactionFromComment(commentId: number, email: string, emoji: string): Observable<void> {
    return this.http.delete<void>(`${this.emojiCommentsUrl}/${commentId}/users/${email}/${emoji}`);
  }

  // ✅ Récupère les utilisateurs ayant réagi avec un emoji spécifique
  getUsersByEmojiAndCommentId(commentId: number, emoji: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.emojiCommentsUrl}/users/${commentId}/${emoji}`);
  }

  // ✅ Récupère les comptes d'emojis pour un commentaire donné
  getEmojiCountsForComment(commentId: number): Observable<{ [emoji: string]: number }> {
    return this.http.get<{ [emoji: string]: number }>(`${this.emojiCommentsUrl}/counts/${commentId}`);
  }
  
}
