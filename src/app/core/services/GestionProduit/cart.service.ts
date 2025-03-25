import { Injectable } from '@angular/core';
import { Cart } from '../../models/GestionProduit/cart';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartService {
 listCarts: Cart[] = [];
 url = 'http://localhost:8084/skillExchange/cart';
  constructor(private http: HttpClient) { }
  getCarts() : Observable<Cart[]> 
  {
   
   return this.http.get<Cart[]>(this.url);
}
addCart(cart: Cart): Observable<Cart> {
 return this.http.post<Cart>(this.url, cart);
}

deleteCart(id:number){
 return this.http.delete(this.url+'/'+id);
}
getCartByID(id:number){
 return this.http.get<Cart>(this.url+'/'+id);
}
updateCart(cart:Cart){
 return this.http.patch(this.url+'/'+cart.id,cart);
}
}
