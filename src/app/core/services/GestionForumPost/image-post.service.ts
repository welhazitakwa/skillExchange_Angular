import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImagePosts } from '../../models/GestionForumPost/image-posts';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagePostService {

  listImagess: ImagePosts[] = [];
  url = 'http://localhost:8084/skillExchange/ImagePosts';
   constructor(private http: HttpClient) { }
   getImages() : Observable<ImagePosts[]> 
   {
    
    return this.http.get<ImagePosts[]>(this.url);
 }
 addImagePosts(imgProd: ImagePosts): Observable<ImagePosts> {
  return this.http.post<ImagePosts>(this.url, imgProd);
 }
 
 deleteImagePosts(id:number){
  return this.http.delete(this.url+'/'+id);
 }
 getImagePostsByID(id:number){
  return this.http.get<ImagePosts>(this.url+'/'+id);
 }
 updateImagePosts(imgPost:ImagePosts){
  return this.http.patch(this.url+'/'+imgPost.id,imgPost);
 }
}
