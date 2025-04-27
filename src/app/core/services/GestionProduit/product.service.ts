import { Injectable } from '@angular/core';
import { Product } from '../../models/GestionProduit/product';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  listProducts: Product[] = [];
 url = 'http://localhost:8084/skillExchange/product';
  constructor(private http: HttpClient) { }
  getProduct() : Observable<Product[]> 
  {
   
   return this.http.get<Product[]>(this.url);
}
addProduct(prod: Product): Observable<Product> {
 return this.http.post<Product>(this.url, prod);
}

deleteProduct(id:number){
 return this.http.delete(this.url+'/'+id);
}
getProductByID(id:number){
 return this.http.get<Product>(this.url+'/'+id);
}
updateProduct(prod:Product){
 return this.http.patch(this.url+'/'+prod.idProduct,prod);
}
}
