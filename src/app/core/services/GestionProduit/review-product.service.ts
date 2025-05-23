import { Injectable } from '@angular/core';
import { ReviewProduct } from '../../models/GestionProduit/review-product';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewProductService {


  url = 'http://localhost:8084/skillExchange/reviewProduct';
  reviews: ReviewProduct[] = [];
  constructor(private http: HttpClient) { }
   
   getReviewByProductID(productId: number): Observable<ReviewProduct[]> {
    return this.http.get<ReviewProduct[]>(`${this.url}/retrieve-reviews-by-product/${productId}`);
  }

 
   getReview() : Observable<ReviewProduct[]> 
   {
    
    return this.http.get<ReviewProduct[]>("http://localhost:8084/skillExchange/reviewProduct/all-Reviews");
 }
 /*addReview(prod: ReviewProduct): Observable<ReviewProduct> {
  return this.http.post<ReviewProduct>(this.url+"/add-ReviewProduct", prod);
 }*/
  addReview(review: ReviewProduct, productId: number): Observable<ReviewProduct> {
    return this.http.post<ReviewProduct>(
       `${this.url}/add-ReviewProduct?productId=${productId}`, 
      review
    );
  }
  
 
 
  deleteReview(id: number) {
    return this.http.delete(`${this.url}/remove-ReviewProduct/${id}`);
  }
  
 getReviewByID(id:number){
  return this.http.get<ReviewProduct>(this.url+'/'+id);
 }
 updatereview(revProd: ReviewProduct) {
  return this.http.patch<ReviewProduct>(`${this.url}/${revProd.idReview}`, revProd);
}

}
