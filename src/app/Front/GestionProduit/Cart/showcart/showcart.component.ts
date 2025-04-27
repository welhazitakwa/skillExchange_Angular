import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { CartProductService } from 'src/app/core/services/GestionProduit/cart-product.service';
import { CartService } from 'src/app/core/services/GestionProduit/cart.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-showcart',
  templateUrl: './showcart.component.html',
  styleUrls: ['./showcart.component.css']
})

export class ShowcartComponent {
  @Input() cartProducts: CartProducts[] = [];
  isActive: boolean = true;
  totalTND: number = 0;
  totalTokens: number = 0;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private cartProductService: CartProductService,
    private cartService: CartService
  ) {}

  currentUser: User | null = null;
  localStorage = localStorage;

  ngOnInit() {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }

    console.log("Email utilisateur :", currentUserEmail);

    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user: User) => {
        this.currentUser = user;
        const userId = user.id;
        localStorage.setItem("userId", String(userId));
        console.log("userId enregistré :", userId);

        this.cartService.getActiveCartByUser(userId).subscribe({
          next: (cart) => {
            if (cart) {
              this.cartProductService.getProductsInCart(cart.id).subscribe({
                next: (cartProducts) => {
                  this.cartProducts = cartProducts;
                  this.calculateTotalPrice();
                  this.checkCartStatus();
                  const count = this.cartProducts.reduce((sum, item) => sum + item.quantity, 0);
                  this.localStorage.setItem("cartCount", String(count));
                  console.log("Produits du panier :", this.cartProducts);
                  console.log("CartCount mis à jour :", count);
                },
                error: (err) => {
                  console.error("Erreur lors du chargement des produits du panier :", err);
                }
              });
            } else {
              console.log("Aucun panier actif trouvé.");
              this.cartProducts = [];
              this.localStorage.setItem("cartCount", "0");
            }
          },
          error: (err) => {
            console.error("Erreur lors de la récupération du panier actif :", err);
          }
        });
      },
      (error) => {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    );
  }

  checkCartStatus(): void {
    this.isActive = this.cartProducts.length > 0;
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
    }
  }
}


