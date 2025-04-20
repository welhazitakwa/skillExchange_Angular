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

   totalTND: number = 0;
   totalTokens: number = 0;

  constructor(private cartProductService: CartProductService) {}

  
    ngOnInit() {
      this.cartProductService.getCartProducts().subscribe(
        (products) => {
          this.cartProducts = products;
        
          console.log("Produits récupérés :", this.cartProducts);
      
          this.calculateTotalPrice(); // Mise à jour du prix total
        },
        (err) => console.error("Erreur lors du chargement du panier :", err)
      );
      console.log("CartProduits récupérés :", this.cartProducts);
      //this.calculateTotalPrice();
    }
  
    calculateTotalPrice() {
      this.totalTND = 0;
      this.totalTokens = 0;
    
      for (const item of this.cartProducts) {
        const price = item.product?.price ?? 0;
        const quantity = item.quantity;
        const currency = item.product?.currencyType;
    
        if (currency === 'TND') {
          this.totalTND += price * quantity;
        } else if (currency === 'TOKENS') {
          this.totalTokens += price * quantity;
        }
      }    }

  
}

