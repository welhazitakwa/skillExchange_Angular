import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Posts } from '../../models/GestionForumPost/Posts';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private url = 'http://localhost:8084/skillExchange/posts';

  constructor(private http: HttpClient) {}

  // Récupérer tous les posts
  getAllPosts(): Observable<Posts[]> {
    return this.http.get<Posts[]>(`${this.url}/retrievePostss`);
  }

  // Récupérer un post par son ID
  getPostByID(id: number): Observable<Posts> {
    return this.http.get<Posts>(`${this.url}/retrievePostsById/${id}`);
  }

  // Ajouter un nouveau post
  addPost(post: Posts): Observable<Posts> {
    return this.http.post<Posts>(`${this.url}/addPosts`, post);
  }

  // Supprimer un post (optionnel)
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/deletePosts/${id}`);
  }
}
