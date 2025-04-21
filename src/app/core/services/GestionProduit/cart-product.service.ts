import { Injectable } from '@angular/core';
import { CartProducts } from '../../models/GestionProduit/cart-products';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartProductService {

listCartProducts: CartProducts[] = [];

 url = 'http://localhost:8084/skillExchange/cart-products';

 constructor(private http: HttpClient) { }

 getProductsInCart(cartId: number): Observable<CartProducts[]> {
  return this.http.get<CartProducts[]>(`${this.url}/cart/${cartId}/products`);
}

   getCartProducts() : Observable<CartProducts[]> 
   {
    
    return this.http.get<CartProducts[]>(`${this.url}/allCartProducts`);
    }
   
    
 
   // Récupérer un produit spécifique du panier par ID
  getCartProductById(cartPId: number): Observable<CartProducts> {
    return this.http.get<CartProducts>(`${this.url}/${cartPId}`);

  }

 /*addCartProduct(cartp: CartProducts): Observable<CartProducts> {
  return this.http.post<CartProducts>(this.url, cartp);
 }*/
  
  addToCart(cartId: number, productId: number, quantity: number): Observable<any> {
    const params = new HttpParams()
    .set('cartId', cartId.toString())
    .set('productId', productId.toString())
    .set('quantity', quantity.toString());
  
    return this.http.post(`${this.url}/add`, null, { params } ).pipe(/*
      tap(updatedCart => {
        console.log("Panier mis à jour:", updatedCart);
      })*/
  ); 
     
     
   }
  
 

  removeProduct(cartPId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete?cartPId=${cartPId}`).pipe(
      tap(() => this.getCartProducts().subscribe()) // Rafraîchir la liste
    );
  }
  
 clearCart(cartId: number): Observable<void> {
  return this.http.delete<void>(`${this.url}/delete?cartId=${cartId}`).pipe(
    tap(() => this.getCartProducts().subscribe()) // Rafraîchir la liste
  );
}
 
  getCartProductByID(id:number){
  return this.http.get<CartProducts>(this.url+'/'+id);
 }
//  updateCartProduct(cartp:CartProducts){
//   return this.http.patch(this.url+'/'+cartp.id,cartp);
//  }
updateCartProduct(cartp: CartProducts): Observable<CartProducts | null> {
  return this.http.patch<CartProducts | null>(
    `${this.url}/update/${cartp.id}?quantity=${cartp.quantity}`,
    null  // pas besoin de body
  );
}


}
