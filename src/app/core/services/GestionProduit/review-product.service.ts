import { Injectable } from '@angular/core';
import { ReviewProduct } from '../../models/GestionProduit/review-product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewProductService {

 reviews: ReviewProduct[] = [];
  url = 'http://localhost:8084/skillExchange/reviwProduct';
   constructor(private http: HttpClient) { }
   getReview() : Observable<ReviewProduct[]> 
   {
    
    return this.http.get<ReviewProduct[]>(this.url);
 }
 addReview(prod: ReviewProduct): Observable<ReviewProduct> {
  return this.http.post<ReviewProduct>(this.url, prod);
 }
 
 deleteReview(id:number){
  return this.http.delete(this.url+'/'+id);
 }
 getReviewByID(id:number){
  return this.http.get<ReviewProduct>(this.url+'/'+id);
 }
 updatereview(revProd:ReviewProduct){
  return this.http.patch(this.url+'/'+revProd.idReview,revProd);
 }
}
