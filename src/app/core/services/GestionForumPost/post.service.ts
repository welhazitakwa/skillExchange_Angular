import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Posts } from '../../models/GestionForumPost/Posts';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private url = 'http://localhost:8084/skillExchange/posts';  // L'URL de votre API backend

  constructor(private http: HttpClient) {}

  // Récupérer tous les posts
  getAllPosts(): Observable<any> {
    return this.http.get<any>(`${this.url}/retrieveBackPostss`);
    
  }
  showPosts(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.url}/retrievePostss?page=${page}&size=${size}`);
  }


  // Récupérer un post par son ID
  getPostByID(id: number): Observable<Posts> {
    return this.http.get<Posts>(`${this.url}/retrievePostsById/${id}`);
  }

  // Ajouter un nouveau post avec une image (via FormData)
  addPost(post: Posts): Observable<Posts> {
    return this.http.post<Posts>(`${this.url}/addPosts`, post);
  }

  // Supprimer un post
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/deletePosts/${id}`);
  }
  approvePost(id: number): Observable<any> {
    return this.http.post(`${this.url}/approvePost/${id}`, {});
  }
  
  rejectPost(id: number): Observable<any> {
    return this.http.post(`${this.url}/rejectPost/${id}`, {});
  }
  
  
  
  
  

  
}
