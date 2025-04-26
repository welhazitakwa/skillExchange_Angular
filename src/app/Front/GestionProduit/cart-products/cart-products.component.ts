import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/core/models/GestionProduit/cart';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
import { CurrencyType } from 'src/app/core/models/GestionProduit/currency-type';
import { Payment, PaymentMethod, PaymentStatus } from 'src/app/core/models/GestionProduit/payment';
import { HistoricTransactions, TransactionType } from 'src/app/core/models/GestionUser/HistoricTransactions';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { CartProductService } from 'src/app/core/services/GestionProduit/cart-product.service';
import { CartService } from 'src/app/core/services/GestionProduit/cart.service';
import { PayementService } from 'src/app/core/services/GestionProduit/payement.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import Swal from 'sweetalert2';
declare var paypal: any;
@Component({
  selector: 'app-cart-products',
  templateUrl: './cart-products.component.html',
  styleUrls: ['./cart-products.component.css']
})
export class CartProductsComponent  {
  @Input() cartProducts: CartProducts[] = [];
  @Input() totalTND!: number;
@Input() totalTokens!: number;
isActive: boolean = true;

  showPaymentModal: boolean = false;
  openPaymentModal(): void {
    if (!this.isActive) {
      alert('Votre panier a été désactivé.');
      return;
    }
    this.showPaymentModal = true;
  
    // 💡 attendre que la vue se mette à jour
    setTimeout(() => {
      this.payService.loadPayPalScript().then(() => {
        this.initPayPalButton();
      });
    }, 50); // 50ms pour être sûr que le DOM soit prêt
  }
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
  
    this.loadCartProducts();
    this.loadCurrentUser();
    
   
  }
  loadCartProducts(){
    this.cartProductService.getCartProducts().subscribe((products) => {
      console.log("Produits du panier récupérés :", products);
      this.cartProducts = products;
    });
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
  validateCartAfterPayment(): void {
    const cartId = this.cartProducts[0]?.cart?.id;
  
    if (!cartId) {
      console.error("⚠️ Cart ID not found for validation.");
      return;
    }
  
    this.cartProductService.validateCart(cartId).subscribe({
      next: () => {
        console.log("✅ Cart validated successfully.");
        localStorage.removeItem("cartId");
        Swal.fire({
          icon: 'success',
          title: 'Cart validated!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          // Recharge proprement : nouvelle session vide
          window.location.reload();
        });
  
       // this.loadCartProducts(); // Recharge panier vide
      },
      error: (err) => {
        console.error('❌ Error validating cart:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error validating cart!',
          text: 'Please try again later.'
        });
      }
    });
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
      const email = localStorage.getItem('userEmail'); 
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
          if (this.currentUser) {
            this.createTransaction(
              this.currentUser,
              -amount,
              TransactionType.PAYMENT,
              'Product  Payment '
                        ).subscribe(
              () => {
               // alert('Withdrawal completed successfully');
               this.validateCartAfterPayment();
              },
              (error) => {
                console.error('Withdrawal transaction failed:', error);
                alert('Withdrawal failed');
              }
            );
          }
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
    
          localStorage.setItem("userEmail", user.email);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    ///////////////////////////////////////////////Transaction////////////////////////////////////////////////////////////////
    private createTransaction(
      recipient: User,
      amount: number,
      transactionType: TransactionType,
      description: string
    ): Observable<any> {
      const transaction: HistoricTransactions = {
        id: null,
        type: transactionType,
        amount: amount,
        description: description,
        date: new Date(),
      };
  
      return this.userService.addTransaction(recipient.id, transaction);
    }
  //////////////////////////
  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('paypal-sdk')) {
        resolve(); return;
      }
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = 'https://www.paypal.com/sdk/js?client-id=AQgP1txB3rkh5U1Tb_7RHytsAQ6qJ_tPZKKkDMFivbiiZ4ppsKMQ4M0EuwY8qpzZ_ZMF699mXRHenUM5&currency=USD'; // 🔁 change client-id
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }
  initPayPalButton() {
    console.log("🔵 PayPal init lancé");
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            description: 'SkillExchange cart payment',
            amount: {
              value: this.totalTND.toFixed(2),
              currency_code: 'USD'
            }
          }]
        });
      },
      onApprove: async (data: any, actions: any) => {
        const details = await actions.order.capture();
        console.log("✅ Payment success:", details);
        this.sendToBackend(details.id);
      },
      onError: (err: any) => {
        console.error("❌ PayPal error:", err);
      }
    }).render('#paypal-button-container');
  }

  sendToBackend(transactionId: string): void {
    const email = localStorage.getItem('userEmail');
    const cartId = this.cartProducts[0]?.cart?.id;
    if (!email || !this.cartId) {
      alert("Missing cart ID or user email.");
      return;
    }

    const payload = {
      userEmail: email,
      cartId: this.cartId,
      montant: this.totalTND,
      transactionId: transactionId
    };

    this.payService.notifyPaypalSuccess(payload).subscribe({
      next: () => {
        alert("📧 Invoice sent and payment saved!");
        this.validateCartAfterPayment();

        localStorage.removeItem("cartProducts");
        window.location.href = "/payment/success";
      },
      error: (err) => {
        console.error("❌ Backend error:", err);
        alert("Error saving payment.");
      }
    });
  }
}
