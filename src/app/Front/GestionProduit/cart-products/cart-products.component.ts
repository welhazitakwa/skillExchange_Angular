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
// 📦 CartProductsComponent amélioré avec corrections complètes

export class CartProductsComponent {
  //////////////////// Properties //////////////////////

  @Input() cartProducts: CartProducts[] = [];
  @Input() totalTND!: number;
  @Input() totalTokens!: number;

  isActive: boolean = true;
  showPaymentModal: boolean = false;
  cartId?: number;
  currentUser: User | null = null;

  //////////////////// Constructor //////////////////////

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private cartProductService: CartProductService,
    private payService: PayementService
  ) {}

  //////////////////// Init //////////////////////

  ngOnInit() {
    const storedCartId = localStorage.getItem('cartId');
    if (storedCartId) this.cartId = Number(storedCartId);
    this.loadCartProducts();
    this.loadCurrentUser();
  }

  ngOnChanges(): void {
    console.log("✅ CartProducts reçus :", this.cartProducts);
  }

  //////////////////// Loaders //////////////////////

  loadCartProducts() {
    this.cartProductService.getCartProducts().subscribe(products => {
      this.cartProducts = products;
      console.log("Produits du panier récupérés :", products);
    });
  }

  private loadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user: User) => {
        this.currentUser = user;
        localStorage.setItem("userEmail", user.email);
      },
      error => console.error(error)
    );
  }

  //////////////////// Cart Operations //////////////////////

  increaseQuantity(cartProduct: CartProducts): void {
    cartProduct.quantity++;
    this.cartProductService.updateCartProduct(cartProduct).subscribe({
      next: updated => {
        if (updated) this.updateLocalStorageCartProducts();
      },
      error: err => {
        cartProduct.quantity--;
        console.error('Erreur:', err);
      }
    });
  }

  decreaseQuantity(cartProduct: CartProducts): void {
    if (cartProduct.quantity > 1) {
      cartProduct.quantity--;
      this.cartProductService.updateCartProduct(cartProduct).subscribe({
        next: updated => {
          if (updated) this.updateLocalStorageCartProducts();
        },
        error: err => console.error('Erreur:', err)
      });
    }
  }
  clearCart(): void {
    console.log("🔴 Clear cart called!");
  
    const cartId = this.cartProducts[0]?.cart?.id; // 🔥 lire directement dans les produits
  
    if (!cartId) {
      console.warn('⚠️ No cart ID found in products.');
      return;
    }
  
    this.cartProductService.clearCart(cartId).subscribe({
      next: () => {
        console.log("✅ Cart cleared successfully.");
  
        this.cartProducts = [];
        this.totalTND = 0;
        this.totalTokens = 0;
        this.isActive = false;
  
        localStorage.removeItem("cartProducts");
        localStorage.setItem("cartCount", "0");
       

  
        Swal.fire('Cart cleared!', 'Your shopping cart is now empty.', 'success');
      },
      error: (err) => {
        console.error("❌ Error clearing cart:", err);
        Swal.fire('Error', 'Failed to clear cart.', 'error');
      }
    });
  }
  
  removeProduct(cartProduct: CartProducts): void {
    this.cartProductService.removeProduct(cartProduct.id).subscribe({
      next: () => {
        this.cartProducts = this.cartProducts.filter(cp => cp.id !== cartProduct.id);
        this.updateLocalStorageCartProducts();
        this.totalTND = 0;
        this.totalTokens = 0;
        
        localStorage.setItem("cartCount", String(this.cartProducts.length));
        //this.loadCartProducts(); 
       
        Swal.fire('Deleted!', 'Product removed from the cart.', 'success');

      },
      error: err => console.error('Erreur suppression:', err)
    });
  }
  
  

  updateLocalStorageCartProducts() {
    localStorage.setItem('cartProducts', JSON.stringify(this.cartProducts));
  }

  // clearCart(): void {
  //   console.log("🔴 Clear cart called !");
  //   if (!this.cartId) return;
  

  //   this.cartProductService.clearCart(this.cartId).subscribe(() => {
  //     this.cartProducts = [];
  //     localStorage.removeItem("cartCount");
  //     Swal.fire('Vidé!', 'Le panier a été vidé.', 'success');
  //   });
  // }

  //////////////////// Payment Operations //////////////////////

  // clearCart(): void {
  //   console.log("🔴 Clear cart called!");
  //   const cartId = this.cartProducts[0]?.cart?.id;

  // if (!cartId) {
  //   console.warn('⚠️ No cart found for the user.');
  //   return;
  // }
  
  //   this.cartProductService.clearCart(cartId).subscribe(() => {
  //     // 🔥 On vide les données locales
  //     this.cartProducts = [];
  //     this.totalTND = 0;
  //     this.totalTokens = 0;
  //     this.isActive = false;
  
  //     localStorage.removeItem("cartProducts");
  //     localStorage.removeItem("cartId");
  //     localStorage.setItem("cartCount", "0");
  
  //     // 🔥 Très important pour l'affichage immédiat sans reload
  //     Swal.fire('Cart cleared!', 'Your shopping cart is now empty.', 'success');
  //   });
  // }
  
  
  
  
  
  
  openPaymentModal(): void {
    if (!this.isActive) {
      Swal.fire('Oops!', 'Votre panier a été désactivé.', 'warning');
      return;
    }
    this.showPaymentModal = true;
    setTimeout(() => this.payService.loadPayPalScript().then(() => this.initPayPalButton()), 50);
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
        Swal.fire({
          icon: 'success',
          title: 'Cart validated!',
          showConfirmButton: false,
          timer: 1500
        });
  
        this.cartProducts = [];
        this.totalTND = 0;
        this.totalTokens = 0;
        localStorage.setItem("cartCount", "0");
        localStorage.removeItem("cartProducts");
        localStorage.removeItem("cartId");
  
        this.loadCartProducts();
      },
      error: (err) => {
        console.error('❌ Error validating cart:', err);
        Swal.fire({
          icon: 'error',
          title: 'Validation Failed',
          text: 'An error occurred while validating your cart.'
        });
      }
    });
  }
  

  payerAvecSolde(): void {
    const cartId = this.cartProducts[0]?.cart?.id;
    const email = localStorage.getItem('userEmail');
    const amount = this.totalTokens;

    if (!cartId || !email || amount <= 0) {
      Swal.fire('Erreur', 'Missing cart, user, or invalid amount.', 'error');
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
      next: () => {
        Swal.fire('Succès', 'Paiement effectué avec votre solde.', 'success');
        if (this.currentUser) {
          this.createTransaction(
            this.currentUser,
            -amount,
            TransactionType.PAYMENT,
            'Product Payment'
          ).subscribe(() => this.validateCartAfterPayment());
        }
      },
      error: err => {
        console.error('Payment error:', err);
        Swal.fire('Erreur', 'Erreur de paiement.', 'error');
      }
    });
  }
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
  

  //////////////////// Helper Functions //////////////////////

  private createTransaction(recipient: User, amount: number, transactionType: TransactionType, description: string): Observable<any> {
    const transaction: HistoricTransactions = {
      id: null,
      type: transactionType,
      amount: amount,
      description: description,
      date: new Date()
    };
    return this.userService.addTransaction(recipient.id, transaction);
  }

  //////////////////// Paypal and other methods //////////////////////

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById('paypal-sdk')) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = 'https://www.paypal.com/sdk/js?client-id=AQgP1txB3rkh5U1Tb_7RHytsAQ6qJ_tPZKKkDMFivbiiZ4ppsKMQ4M0EuwY8qpzZ_ZMF699mXRHenUM5&currency=USD';
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }

  initPayPalButton() {
    paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
      createOrder: (data: any, actions: any) => actions.order.create({
        purchase_units: [{
          description: 'SkillExchange cart payment',
          amount: { value: this.totalTND.toFixed(2), currency_code: 'USD' }
        }]
      }),
      onApprove: async (data: any, actions: any) => {
        const details = await actions.order.capture();
        console.log('✅ Payment success:', details);
        this.sendToBackend(details.id);
      },
      onError: (err: any) => console.error('❌ PayPal error:', err)
    }).render('#paypal-button-container');
  }

  sendToBackend(transactionId: string): void {
    const email = localStorage.getItem('userEmail');
    const cartId = this.cartProducts[0]?.cart?.id;

    if (!email || !cartId) {
      Swal.fire('Erreur', 'Missing cart ID or email.', 'error');
      return;
    }

    const payload = {
      userEmail: email,
      cartId: cartId,
      montant: this.totalTND,
      transactionId: transactionId
    };

    this.payService.notifyPaypalSuccess(payload).subscribe({
      next: () => {
        Swal.fire('Succès', 'Paiement PayPal enregistré.', 'success');
        this.validateCartAfterPayment();
        window.location.href = "/payment/success";
      },
      error: (err) => {
        console.error('❌ Backend error:', err);
        Swal.fire('Erreur', 'Erreur serveur.', 'error');
      }
    });
  }

}

