import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
import { CartProductService } from 'src/app/core/services/GestionProduit/cart-product.service';
import { CartService } from 'src/app/core/services/GestionProduit/cart.service';

@Component({
  selector: 'app-cart-products',
  templateUrl: './cart-products.component.html',
  styleUrls: ['./cart-products.component.css']
})
export class CartProductsComponent  {
  @Input() cartProducts: CartProducts[] = [];



 
 //cartProducts: CartProducts[] = []; 
 cartId!: number;

  constructor(private cartProductService: CartProductService) {}
  
  

 ngOnInit() {
  
  this.cartId = 1; 
    this.cartProductService.getCartProducts().subscribe((products) => {
      console.log("Produits du panier récupérés :", products);
      this.cartProducts = products;
    });
   
   
  }
  
increaseQuantity(cartProduct: CartProducts): void {
  this.cartProductService.updateCartProduct(cartProduct).subscribe(
    (updatedCartProduct) => {
      cartProduct.quantity++; // Mise à jour locale sans reload
      console.log('Produit mis à jour avec succès : ', updatedCartProduct);
    },
    (error) => {
      console.error('Erreur lors de la mise à jour du produit : ', error);
    }
  );
}

  // Diminuer une unité du produit au panier
  decreaseQuantity(cartProduct: CartProducts): void {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity--;  // Diminuer la quantité
      this.updateCartProduct(cartProduct);  // Mettre à jour le produit après modification de la quantité
    }
  }

  // Mettre à jour un produit dans le panier via CartService
 /* updateCartProduct(cartProduct: CartProducts): void {
    this.cartProductService.updateCartProduct(cartProduct).subscribe(
      (updatedCartProduct) => {
        console.log('Produit mis à jour avec succès : ', updatedCartProduct);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du produit : ', error);
      }
    );
  }*/
    updateCartProduct(cartProduct: CartProducts): void {
      this.cartProductService.updateCartProduct(cartProduct).subscribe(
        (updatedCartProduct) => {
          if (updatedCartProduct) {
            console.log('Produit mis à jour avec succès : ', updatedCartProduct);
          } else {
            // Si `null`, c'est que le produit a été supprimé
            this.cartProducts = this.cartProducts.filter(cp => cp.id !== cartProduct.id);
            alert('Produit supprimé du panier !');
          }
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit : ', error);
        }
      );
    }
    

  removeProduct(cartProduct: CartProducts): void {
    this.cartProductService.removeProduct(cartProduct.id).subscribe({
      next: () => {
        this.cartProducts = this.cartProducts.filter(cp => cp.id !== cartProduct.id);
        alert("Produit supprimé du panier !");
      },
      error: (err) => {
        console.error("Erreur lors de la suppression du produit", err);
      }
    });
  }
  
  clearCart(): void {
    this.cartProductService.clearCart(this.cartId).subscribe(
       () => {
        this.cartProducts = []; // Mettre à jour l'affichage
       // this.cartCount = 0;
       localStorage.removeItem("cartCount");
      
        alert("Le panier a été vidé !");
      },
       (err) => {
        console.error("Erreur lors du vidage du panier", err);
      }
    );
  }
  
 
  validateCart(): void {
    if (this.cartProducts.length === 0) {
      alert("Votre panier est vide !");
      return;
    }
    
    // Ici, on pourrait appeler un service pour finaliser la commande
    alert("Panier validé avec succès !");
  }
 
}
