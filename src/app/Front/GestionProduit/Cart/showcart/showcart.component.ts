import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
import { CartProductService } from 'src/app/core/services/GestionProduit/cart-product.service';

@Component({
  selector: 'app-showcart',
  templateUrl: './showcart.component.html',
  styleUrls: ['./showcart.component.css']
})

export class  ShowcartComponent {
  //@Output() cartChanged = new EventEmitter<void>(); // Nouvel EventEmitter
   @Input() cartProducts: CartProducts[] = [];

  totalPrice: number = 0;

  constructor(private cartProductService: CartProductService) {}

  
    ngOnInit() {
     /* this.cartProductService.getCartProducts().subscribe(
        (products) => {
          this.cartProducts = products;
        
          console.log("Produits récupérés :", this.cartProducts);
      
          this.calculateTotalPrice(); // Mise à jour du prix total
        },
        (err) => console.error("Erreur lors du chargement du panier :", err)
      );*/
      console.log("CartProduits récupérés :", this.cartProducts);
    }
  
    calculateTotalPrice() {
      this.totalPrice = this.cartProducts.reduce((total, item) => total + (item.product?.price ?? 0) * item.quantity, 0);
    }

  
}

