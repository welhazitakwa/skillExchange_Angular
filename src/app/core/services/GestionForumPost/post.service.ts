import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Posts } from '../../models/GestionForumPost/Posts';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  url = 'http://localhost:8084/skillExchange/posts';

  constructor(private http: HttpClient) {}

  getAllPosts(): Observable<any> {
    return this.http.get<Posts[]>(this.url+"/retrievePostss");
  }
  getPostByID(id:number){
    return this.http.get<Posts>(`${this.url}/retrievePostsById/${id}`);
  }
}
