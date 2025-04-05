import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentPosts } from '../../models/GestionForumPost/CommentPosts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentPostsService {

  
  url = 'http://localhost:8084/skillExchange/commentPosts';
  
    constructor(private http: HttpClient) {}
  
    getAllCommentPosts(): Observable<any> {
      return this.http.get<CommentPosts[]>(this.url+"/retrieveCommentPosts");
    }
}
