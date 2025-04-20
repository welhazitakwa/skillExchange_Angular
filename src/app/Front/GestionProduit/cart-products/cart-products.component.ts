import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from 'src/app/core/models/GestionProduit/cart';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
import { CurrencyType } from 'src/app/core/models/GestionProduit/currency-type';
import { Payment, PaymentMethod, PaymentStatus } from 'src/app/core/models/GestionProduit/payment';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { CartProductService } from 'src/app/core/services/GestionProduit/cart-product.service';
import { CartService } from 'src/app/core/services/GestionProduit/cart.service';
import { PayementService } from 'src/app/core/services/GestionProduit/payement.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-cart-products',
  templateUrl: './cart-products.component.html',
  styleUrls: ['./cart-products.component.css']
})
export class CartProductsComponent  {
  @Input() cartProducts: CartProducts[] = [];
  @Input() totalTND!: number;
@Input() totalTokens!: number;


  showPaymentModal: boolean = false;
  updateLocalStorageCartProducts() {
    localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
  }

 
 //cartProducts: CartProducts[] = []; 
 

  constructor(private router: Router, private authService: AuthService,
      private userService: UserService,
      private route: ActivatedRoute,private cartProductService: CartProductService,private payService: PayementService) {}
  
  ngOnChanges(): void {
    console.log("✅ CartProducts reçus :", this.cartProducts);
  }

 ngOnInit() {
  
 
    const storedCartId = localStorage.getItem('cartId');
    if (storedCartId) {
      this.cartId = Number(storedCartId);
    } else {
      console.warn("Aucun cartId trouvé dans le localStorage.");
    }
  
    this.cartProductService.getCartProducts().subscribe((products) => {
      console.log("Produits du panier récupérés :", products);
      this.cartProducts = products;
    });
    this.loadCurrentUser();
   
  }
  // loadCartId() {
  //   const storedCartId = localStorage.getItem('cartId');
  //   if (storedCartId) {
  //     this.cartId = Number(storedCartId);  // Utiliser le cartId trouvé dans localStorage
  //   } else {
  //     // Créer un panier pour l'utilisateur si aucun cartId n'est trouvé
  //     this.cartId = undefined;  // Aucun panier n'est encore créé ou associé à l'utilisateur
  //   }
  // }
  

increaseQuantity(cartProduct: CartProducts): void {
  cartProduct.quantity++; // D'abord on met à jour localement la quantité

  this.cartProductService.updateCartProduct(cartProduct).subscribe(
    (updatedCartProduct) => {
      console.log('Produit mis à jour avec succès : ', updatedCartProduct);
      this.cartProducts = [...this.cartProducts];
      this.updateLocalStorageCartProducts();
    },
    (error) => {
      console.error('Erreur lors de la mise à jour du produit : ', error);
      cartProduct.quantity--; // En cas d’erreur, on revient à l’ancienne valeur
    }
  );
}


  // Diminuer une unité du produit au panier
  decreaseQuantity(cartProduct: CartProducts): void {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity--;  // Diminuer la quantité
      this.cartProducts = [...this.cartProducts];
      this.updateCartProduct(cartProduct);  // Mettre à jour le produit après modification de la quantité
      //this.updateLocalStorageCartProducts();
    }
  }

 
    updateCartProduct(cartProduct: CartProducts): void {
      this.cartProductService.updateCartProduct(cartProduct).subscribe(
        (updatedCartProduct) => {
          if (updatedCartProduct) {
            console.log('Produit mis à jour avec succès : ', updatedCartProduct);
            this.cartProducts = [...this.cartProducts]; // <- force le changement
        this.updateLocalStorageCartProducts();      // <- synchroniser
          } else {
            // Si `null`, c'est que le produit a été supprimé
            this.cartProducts = this.cartProducts.filter(cp => cp.id !== cartProduct.id);
            this.updateLocalStorageCartProducts(); // important ici aussi
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
        this.updateLocalStorageCartProducts();
        const count = this.cartProducts.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cartCount", String(count));
        
        alert("Produit supprimé du panier !");
      },
      error: (err) => {
        console.error("Erreur lors de la suppression du produit", err);
      }
    });
  }
  
  
  cartId?: number;
  clearCart(): void {
    if (this.cartId === undefined) {
      alert("Aucun panier trouvé pour l'utilisateur actuel.");
      return;
    }
  
    this.cartProductService.clearCart(this.cartId).subscribe(
      () => {
        this.cartProducts = [];
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
    
    
    alert("Panier validé avec succès !");
  }
 


 
  ////////////////////payment//////////////////////
  payment: Payment = new Payment();
  
   
    payerAvecStripe(): void {
     // const amount = this.payment.montant;
     const amount = this.totalTND
      //const cartId = this.payment.cart?.id;
      const cartId = this.cartProducts[0]?.cart?.id;
      if (!amount || !cartId) {
        alert("Montant ou panier non défini.");
        return;
      }
    
      this.payService.createStripeSession(amount, cartId).subscribe(
        (sessionUrl: string) => {
          window.location.href = sessionUrl;
        },
        error => {
          console.error('Erreur Stripe:', error);
        }
      );
    }
    payerAvecSolde(): void {
      const cartId = this.cartProducts[0]?.cart?.id;
      const email = localStorage.getItem('userEmail'); // assure-toi qu'il est stocké après le login
      const amount = this.totalTokens;
      console.log("💬 PAY WITH BALANCE DEBUG", { cartId, email, amount });
      if (!cartId || !email || amount<=0) {
        alert("Missing cart, amount or user information.");
        return;
      }
    
      const payment: Payment = {
        montant: amount,
        methodePaiement: PaymentMethod.BALANCE,
        statutPaiement: PaymentStatus.PENDING,
        userEmail: this.currentUser?.email,
        cart: { id: +cartId } as Cart,
        currencyType: CurrencyType.TOKENS,
        datePaiement: new Date()
      };
    
      this.payService.createPayment2(payment).subscribe({
        next: res => {
          alert("✅ Payment completed using balance.");
          localStorage.removeItem('cartProducts');
          location.reload();
        },
        error: err => {
          console.error("❌ Error during balance payment:", err);
          alert("Payment failed. Insufficient balance or invalid user.");
        }
      });
    }
    currentUser: User | null = null;
    private loadCurrentUser() {
      const currentUserEmail = this.authService.getCurrentUserEmail();
    
      if (!currentUserEmail) {
        this.router.navigate(['/login']);
        return;
      }
    
      console.log(currentUserEmail);
    
      this.userService.getUserByEmail(currentUserEmail).subscribe(
        (user: User) => {
          this.currentUser = user;
    
          // ✅ Sauvegarder l'email pour le paiement
          localStorage.setItem("userEmail", user.email);
        },
        (error) => {
          console.error(error);
        }
      );
    }
     
}
