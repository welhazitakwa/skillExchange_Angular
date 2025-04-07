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
import { ImageProduct } from 'src/app/core/models/GestionProduit/image-product';
type ProductToSend = Omit<Product, 'postedBy' | 'idProduct'>;
@Component({
  selector: 'app-showproduct',
  templateUrl: './showproduct.component.html',
  styleUrls: ['./showproduct.component.css']
})

export class ShowproductComponent implements OnInit {
  newProduct:  Product =new Product();
 
  isCartOpen = false;
  cartCount = 0; // À mettre à jour dynamiquement selon le panier

 
products: Product[] = [];
cartProducts: CartProducts[] = [];
localStorage=localStorage;

currentUser: User | null = null;
selectedImages: File[] = [];
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
    this.loadCurrentUser(); 
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
      },
      (error) => {
        console.error(error);
      }
    );
  }
 

  cartId: number = 1;
  
  
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
                this.cartCount += 1;
                const count = Number(localStorage.getItem('cartCount')) || 0;
                this.localStorage.setItem("cartCount", String(count + 1));
                this.loadCartProducts();
              },
              error: err => console.error('Erreur lors de la mise à jour de la quantité', err)
            });
      
          } else {
            console.log("Produit ajouté au panier");
            this.cartProductService.addToCart(this.cartId, product.idProduct, 1).subscribe({
              next: (response) => {
                // ⛔ Ne pas décrémenter product.stock ici
                this.cartProducts.push({
                  id: response.id,
                  cart: { id: this.cartId } as Cart,
                  product: product,
                  quantity: 1
                });
      
                const count = Number(localStorage.getItem('cartCount')) || 0;
                this.localStorage.setItem("cartCount", String(count + 1));
                console.log('CartCount après ajout:', this.cartCount);
                this.loadCartProducts();
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

  onImageSelected(event: any): void {
    this.selectedImages = event.target.files;
  }

  
   
    submitNewProduct() {
      if (this.newProduct) {
        const productToSend: ProductToSend = {
          productName: this.newProduct.productName,
          type: this.newProduct.type,
          price: this.newProduct.price,
          stock: this.newProduct.stock,
          cartProducts: [],
          reviewProducts: [],
          imageProducts: []
        };
    
        this.productService.addProduct(productToSend as Product).subscribe(
          (response) => {
            console.log('Product added successfully!', response);
          //  this.resetForm();
          },
          (error) => {
            console.error('Error adding product', error);
          }
        );
      } else {
        console.error('Product is missing');
      }
    }
   
    showModalProduct = false;
editingProduct: Product = {
  idProduct: 0,
  productName: '',
  type: '',
  price: 0,
  
  stock: 0,
  postedBy : null,
  cartProducts: [],
  reviewProducts: [],
  imageProducts: []
};

startEditProduct(product: Product) {
  this.editingProduct = { ...product }; // clone pour édition
  this.showModalProduct = true;
}

cancelEditProduct() {
  this.showModalProduct = false;
}

submitEditProduct() {
  this.productService.updateProduct(this.editingProduct).subscribe(
    () => {
      console.log('Product updated');
      this.productService.getProduct().subscribe(
        (products) => {
          this.products = products;
          console.log(this.products); // Vérifier si les produits sont bien récupérés
        },
        (error) => {
          console.error('Erreur lors de la récupération des produits', error);
        }
      );
      this.showModalProduct = false;
    },
    (error) => console.error('Error updating product', error)
  );
}

deleteProduct(id: number) {
  if (confirm('Are you sure you want to delete this product?')) {
    this.productService.deleteProduct(id).subscribe(
      () => {
        console.log('Product deleted');
        this.productService.getProduct().subscribe(
          (products) => {
            this.products = products;
            console.log(this.products); // Vérifier si les produits sont bien récupérés
          },
          (error) => {
            console.error('Erreur lors de la récupération des produits', error);
          }
        );
      },
      (error) => console.error('Error deleting product', error)
    );
  }
}

    
    
  // Méthode pour réinitialiser le formulaire
  resetForm(): void {
    this.newProduct = new Product(); // Réinitialiser les champs
    this.selectedImages = []; // Réinitialiser les images sélectionnées
  }
}




  

