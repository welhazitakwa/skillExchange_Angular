import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentPosts } from 'src/app/core/models/GestionForumPost/CommentPosts';

@Injectable({
  providedIn: 'root'
})
export class CommentPostsService {

  private url = 'http://localhost:8084/skillExchange/commentPosts';

  constructor(private http: HttpClient) {}

  getAllCommentPosts(): Observable<CommentPosts[]> {
    return this.http.get<CommentPosts[]>(`${this.url}/retrieveCommentPosts`);
  }

  addComment(comment: CommentPosts, postId: number): Observable<CommentPosts> {
    return this.http.post<CommentPosts>(`${this.url}/addComPosts?postId=${postId}`, comment);
  }

  getCommentsByPost(postId: number): Observable<CommentPosts[]> {
    return this.http.get<CommentPosts[]>(`${this.url}/retrieveCommentPostsByPost/${postId}`);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/deleteComPosts/${commentId}`);
  }
  generateComment(payload: { postContent: string; postId: number }): Observable<any> {
    return this.http.post<any>('http://localhost:8084/skillExchange/commentPosts/generateComment', payload);
  }
  
  
  
  
}
