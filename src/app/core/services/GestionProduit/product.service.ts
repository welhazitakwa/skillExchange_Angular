import { Injectable } from '@angular/core';
import { Product } from '../../models/GestionProduit/product';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { ReviewProduct } from '../../models/GestionProduit/review-product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  listProducts: Product[] = [];
 url = 'http://localhost:8084/skillExchange/product';
  constructor(private http: HttpClient) { }

getProduct() : Observable<Product[]> 
  {
   
   return this.http.get<Product[]>(`${this.url}/retrieve-products`);}

addProduct(prod: Product): Observable<Product> {
 return this.http.post<Product>(this.url, prod);
}

deleteProduct(id:number){
 return this.http.delete(this.url+'/'+id);
}
getProductByID(id:number){
  return this.http.get<Product>(`${this.url}/retrieve-products/${id}`);
}
updateProduct(prod:Product){
 return this.http.patch(this.url+'/'+prod.idProduct,prod);
}

addProductReview(productId: number, review: ReviewProduct): Observable<ReviewProduct> {
  return this.http.post<ReviewProduct>(`${this.url}/${productId}/reviews`, review);
}

}
