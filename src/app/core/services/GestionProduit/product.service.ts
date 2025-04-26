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
  // addProductImages(productId: number, images: string[]): Observable<Product> {
  //   const formData = new FormData();
  //   formData.append('files', images.join(', '));  // Concaténer les images Base64 en une seule chaîne (si nécessaire)

  //   return this.http.post<Product>(`${this.url}/${productId}/images`, images);
  // }

  getProduct(): Observable<Product[]> {

    return this.http.get<Product[]>(`${this.url}/retrieve-products`);
  }
  getApprovedProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(`${this.url}/Allapproved`);
  }

  addProduct(prod: Product): Observable<Product> {
    return this.http.post<Product>(this.url + "/add", prod);
  }

  deleteProduct(id: number) {
    return this.http.delete(this.url + "/delete/" + id);
  }
  getProductByID(id: number) {
    return this.http.get<Product>(`${this.url}/retrieve-products/${id}`);
  }
  updateProduct(prod: Product) {
    return this.http.patch(this.url + "/modify-product/${id}" , prod);

  }
  approveProduct(id: number): Observable<any> {
    return this.http.put(`${this.url}/approve/${id}`, null, { responseType: 'text' }); 
  }
  
  rejectProduct(id: number): Observable<any> {
    return this.http.delete(`${this.url}/reject/${id}`, { responseType: 'text' });
  }
  
  // updateProduct(id: number, data: FormData) {
  //   return this.http.patch<Product>(`${this.url}/update/${id}`, data);
  // }
  

  /*addProductReview(productId: number, review: ReviewProduct): Observable<ReviewProduct> {
    return this.http.post<ReviewProduct>(`${this.url}/${productId}/reviews`, review);
  }*/

}
