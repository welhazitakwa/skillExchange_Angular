import { Component, OnInit, ViewChild } from '@angular/core';
import { Cart } from 'src/app/core/models/GestionProduit/cart';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
import { Product } from 'src/app/core/models/GestionProduit/product';
import { ReviewProduct } from 'src/app/core/models/GestionProduit/review-product';
import { CartProductService } from 'src/app/core/services/GestionProduit/cart-product.service';
import { CartService } from 'src/app/core/services/GestionProduit/cart.service';
import { ProductService } from 'src/app/core/services/GestionProduit/product.service';
import { CartProductsComponent } from '../../cart-products/cart-products.component';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-showproduct',
  templateUrl: './showproduct.component.html',
  styleUrls: ['./showproduct.component.css']
})

export class ShowproductComponent implements OnInit {
 
  isCartOpen = false;
  cartCount = 0; // À mettre à jour dynamiquement selon le panier

 
products: Product[] = [];
cartProducts: CartProducts[] = [];
localStorage=localStorage;

currentUser=1;/*User | null = null;*/

  constructor(private router: Router,private authService: AuthService,  
      private userService: UserService,
      private route: ActivatedRoute,private productService: ProductService, private cartProductService:CartProductService,private cartService: CartService) {}

  ngOnInit(){
    /*this.cartService.currentItemCount.subscribe(count => {
      this.cartCount = count;
    });
    */
   
    // Fetch the cart products immediately
   this.loadCartProducts();
    this.productService.getProduct().subscribe(
      (products) => {
        this.products = products;
        console.log(this.products); // Vérifier si les produits sont bien récupérés
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
    //this.cartCount = this.cartProducts.reduce((sum, item) => sum + item.quantity, 0);
    //this.loadCurrentUser();
  

    
    
  }
  /*private loadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user: User) => {
        this.currentUser = user;
      },
      (error) => {
        console.error(error);
      }
    );
  }*/
 

  cartId: number = 1;
  
   // Méthode pour ajouter un produit au panier
   /*addToCart(product:Product):void  {
    console.log(`Ajout au panier - CartID: ${this.cartId}, ProductID: ${product.idProduct}`);
    if (product.stock > 0) {
      this.cartProductService.addToCart(this.cartId, product.idProduct, 1).subscribe(
        () => { // 🔄 On récupère directement la réponse du backend
          /*console.log('Produit ajouté au panier !');
          alert('Produit ajouté au panier !');*/
         /* product.stock--; 
          
          this.loadCartProducts();
       */
      //  this.cartCount ++;
/*
      
      }
    , error => {
        console.error('Erreur lors de l\'ajout au panier', error);
        alert('Erreur lors de l\'ajout au panier');
      });
    } else {
      alert('Stock épuisé, impossible d\'ajouter au panier.');
    }
  }*/
    // Méthode pour ajouter ou mettre à jour un produit dans le panier
    addToCart(product: Product): void {
      console.log(`Ajout au panier - CartID: ${this.cartId}, ProductID: ${product.idProduct}`);
    
      if (product.stock > 0) {
        const existingProduct = this.cartProducts.find(cartProduct => cartProduct.product.idProduct === product.idProduct);
    
        if (existingProduct) {
          console.log("Produit déjà dans le panier, mise à jour de la quantité.");
          existingProduct.quantity++;
    
          this.cartProductService.updateCartProduct(existingProduct).subscribe({
            next: () => {
              console.log('Quantité mise à jour');
              this.cartCount += 1; // ✅ Incrémentation correcte du compteur
              const count  = Number(localStorage.getItem('cartCount')) ;
                     
              //this.cartCount=count;
              this.localStorage.setItem("cartCount",String(count+1));
              this.loadCartProducts();
            },
            error: err => console.error('Erreur lors de la mise à jour de la quantité', err)
          });
    
        } else {
          console.log("Produit ajouté au panier");
          this.cartProductService.addToCart(this.cartId, product.idProduct, 1).subscribe({
            next: (response) => {
              product.stock--;
    
              this.cartProducts.push({
                id: response.id,
                cart: { id: this.cartId } as Cart, 
                product: product,
                quantity: 1
              });
    
              const count  = Number(localStorage.getItem('cartCount')) ;
                     
              //this.cartCount=count;
              this.localStorage.setItem("cartCount",String(count+1));
              console.log('CartCount après ajout:', this.cartCount);
              this.loadCartProducts(); // Recharge les produits du panier
            },
            error: err => console.error('Erreur lors de l\'ajout au panier', err)
          });
        }
      } else {
        alert('Stock épuisé, impossible d\'ajouter au panier.');
      }
    }
    

    
    loadCartProducts(): void {
      this.cartProductService.getCartProducts().subscribe({
        next: (cartProducts) => {
          // Log pour vérifier le contenu de la réponse
          console.log(cartProducts);
    
          // Traitement des produits du panier
          this.cartProducts = cartProducts;
          /*const count  = this.cartProducts.reduce((sum, item) => sum + item.quantity, 0); // ✅ Calcul après le chargement
        
          //this.cartCount=count;
          this.localStorage.setItem("cartCount",String(count));*/
          console.log("Panier mis à jour :", this.cartProducts);
          console.log("CartCount mis à jour :", this.cartCount);
        },
        error: (err) => {
          console.error("Erreur lors du chargement du panier :", err);
          alert("Erreur lors du chargement du panier.");
        }
      });
    }
    
    
    

  toggleCart() {
    this.isCartOpen = !this.isCartOpen;
  }
}
  

