import { Injectable } from '@angular/core';
import { Cart } from '../../models/GestionProduit/cart';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CartService {
 listCarts: Cart[] = [];
 url = 'http://localhost:8084/skillExchange/cart';
  constructor(private http: HttpClient) { this.initializeCartCount();}
  
 /* private itemCountSource = new BehaviorSubject<number>(0);
  public currentItemCount = this.itemCountSource.asObservable();*/
   // Initialiser le compteur au démarrage
   private initializeCartCount() {
    this.getCarts().subscribe(carts => {
      this.listCarts = carts;
    //  this.updateItemCount();
    });
  }

  


  // Mettre à jour le compteur
 /* private updateItemCount(): void {
    const total = this.listCarts.reduce((sum, cart) => {
      const cartTotal = cart.cartProducts?.reduce((cartSum, item) => {
        return cartSum + (item.quantity || 0);
      }, 0) || 0;
      return sum + cartTotal;
    }, 0);
    
    this.itemCountSource.next(total);
  }
*/
  // Méthode pour valider le panier
  validateCart(cartId: number): Observable<any> {
    return this.http.post(`${this.url}/validate-cart`, { cartId });
  }
  public refreshCartCount(): void {
    this.getCarts().subscribe(carts => {
      this.listCarts = carts;
   //   this.updateItemCount();
    });
  }


 getCarts() : Observable<Cart[]> 
  {
   
   return this.http.get<Cart[]>(`${this.url}/retrieve-carts`)/*.pipe(
    catchError(error => {
      console.error('Error fetching products:', error);
      return of([]); // Retourne un tableau vide en cas d'erreur
    })
  );*/
  .pipe(
    tap(carts => {
      this.listCarts = carts; // Mettre à jour la liste locale
    })
  );
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
 // ✅ Rafraîchir manuellement le panier après une action
 refreshCart(): void {
  this.getCarts().subscribe();
}


}
