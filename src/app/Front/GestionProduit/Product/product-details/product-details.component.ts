import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from 'src/app/core/models/GestionProduit/cart';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
import { ImageProduct } from 'src/app/core/models/GestionProduit/image-product';
import { Product } from 'src/app/core/models/GestionProduit/product';
import { ReviewProduct } from 'src/app/core/models/GestionProduit/review-product';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { CartProductService } from 'src/app/core/services/GestionProduit/cart-product.service';
import { CartService } from 'src/app/core/services/GestionProduit/cart.service';
import { ProductService } from 'src/app/core/services/GestionProduit/product.service';
import { ReviewProductService } from 'src/app/core/services/GestionProduit/review-product.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  
  isCartOpen = false;
  cartCount = 0; // À mettre à jour dynamiquement selon le panier

  
  productId!: number; 
  product: Product | undefined;
 // product: Product | null = null;
  currentUser: User | null = null;
  usersMap: { [key: string]: User } = {};
  cartProducts: CartProducts[] = [];
  cartId?: number;
  localStorage = localStorage;
  
  


  constructor(
    private productService: ProductService,
    private reviewService: ReviewProductService,
    private authService: AuthService,  
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private cartProductService:CartProductService,private cartService: CartService
  ) {}

  goToImage(index: number): void {
    this.currentImageIndex = index;
    this.scrollCarouselToIndex(index);
  }
  
  ngOnInit(): void {
    
    this.productId =Number(this.route.snapshot.paramMap.get('idProduct')) ; 
    this.getProductDetails();
    this.getReviews(); 
    this.loadCurrentUser();
    this.loadCartProducts();
    this.loadCartCount();
  }
  loadCartCount(): void {
    const count = Number(localStorage.getItem('cartCount')) || 0;
    this.cartCount = count;
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
    this.loadCartProducts();
  }
  loadUserDetails(): void {
    this.reviews.forEach(review => {
      if (review.email && !this.usersMap[review.email]) { 
        this.userService.getUserByEmail(review.email).subscribe(
          (user: User) => {
            this.usersMap[review.email] = user;
          },
          (error) => {
            console.error(`Error fetching user details for ${review.email}`, error);
          }
        );
      }
    });
  }

  getProductDetails(): void {
    this.productService.getProductByID(this.productId).subscribe(
      (product) => {
        this.product = product;
        if (product.imageProducts?.length) {
          this.mainImageUrl = product.imageProducts[0].image;
        }
      },
      (error) => {
        console.error('Error fetching product details', error);
      }
    );
  }
   // Gestion des images
   currentImageIndex = 0;
   currentImage: ImageProduct | null = null;
   mainImageUrl: string = '';
 
  //mainImageUrl: string = '';
  nextImage(): void {
    if (this.product?.imageProducts?.length) {
      this.currentImageIndex = 
        (this.currentImageIndex + 1) % this.product.imageProducts.length;
      this.updateCurrentImage();
    }
  }
  prevImage(): void {
    if (this.product?.imageProducts?.length) {
      this.currentImageIndex = 
        (this.currentImageIndex - 1 + this.product.imageProducts.length) % 
        this.product.imageProducts.length;
      this.updateCurrentImage();
    }
  }

  private updateCurrentImage(): void {
    if (this.product?.imageProducts) {
      this.currentImage = this.product.imageProducts[this.currentImageIndex];
      this.mainImageUrl = this.currentImage.image;
    }
  }
  setMainImage(imgProduct: ImageProduct): void {
    this.mainImageUrl = imgProduct.image;
    const index = this.product?.imageProducts?.findIndex(img => img.image === imgProduct.image) ?? 0;
    this.currentImageIndex = index;
    this.scrollCarouselToIndex(index);
  }
  private scrollCarouselToIndex(index: number): void {
    const carousel = document.getElementById('productImageCarousel');
    if (carousel) {
      const carouselInstance = new (window as any).bootstrap.Carousel(carousel);
      carouselInstance.to(index);
    }
  }

  



 


  
  addToCart(product: Product): void {
    if (product.stock <= 0) {
      alert('Stock épuisé, impossible d\'ajouter au panier.');
      return;
    }
    if (!this.currentUser) {
      alert('Vous devez être connecté');
      this.router.navigate(['/login']);
      return;
    }
    
    const userId = this.currentUser.id;
   
    if (!userId) {
      alert('Utilisateur non trouvé dans le localStorage. Vous devez être connecté.');
      console.log('ID utilisateur récupéré depuis localStorage :', userId);
      this.router.navigate(['/login']);  // Redirige vers la page de connexion si l'utilisateur n'est pas trouvé
      return;
    }
  
    this.cartId = Number(localStorage.getItem('cartId'));  // Récupère l'ID du panier (s'il existe)
  
    if (!this.cartId) {
      // Si aucun panier n'existe, créer un nouveau panier pour cet utilisateur
      const newCart = { user: { id: Number(userId) } };
  
      this.cartService.addCart(newCart as Cart).subscribe({
        next: (createdCart) => {
          this.cartId = createdCart.id;
          localStorage.setItem('cartId', String(this.cartId));  // Sauvegarde le cartId dans le localStorage
          this.addProductToCart(product);  // Ajoute le produit au panier
        },
        error: (err) => {
          console.error('Erreur lors de la création du panier', err);
          alert('Erreur lors de la création du panier');
        }
      });
    } else {
      // Si un panier existe déjà, on ajoute le produit
      this.addProductToCart(product);
    }
  }
  
  private addProductToCart(product: Product): void {
    const existingProduct = this.cartProducts.find(cartProduct => cartProduct.product.idProduct === product.idProduct);
  
    if (existingProduct) {
      existingProduct.quantity++;
      this.cartProductService.updateCartProduct(existingProduct).subscribe({
        next: () => {
          console.log('Quantité mise à jour');
          this.updateCartCount();
          this.loadCartProducts();
        },
        error: err => console.error('Erreur lors de la mise à jour de la quantité', err)
      });
    } else {
      // Ajouter un nouveau produit au panier
      this.cartProductService.addToCart(this.cartId!, product.idProduct, 1).subscribe({
        next: (response) => {
          this.cartProducts.push({
            id: response.id,
            cart: { id: this.cartId } as Cart,
            product: product,
            quantity: 1
          });
          this.updateCartCount();
          this.loadCartProducts();
        },
        error: err => console.error('Erreur lors de l\'ajout au panier', err)
      });
    }
  }
  loadCartProducts(): void {
    this.cartProductService.getCartProducts().subscribe({
      next: (cartProducts) => {
        // Log pour vérifier le contenu de la réponse
        console.log(cartProducts);

        // Traitement des produits du panier
        this.cartProducts = cartProducts;
        const count  = this.cartProducts.reduce((sum, item) => sum + item.quantity, 0); // ✅ Calcul après le chargement
      
        //this.cartCount=count;
        this.localStorage.setItem("cartCount",String(count));
        console.log("Panier mis à jour :", this.cartProducts);
        console.log("CartCount mis à jour :", this.cartCount);
      },
      error: (err) => {
        console.error("Erreur lors du chargement du panier :", err);
        alert("Erreur lors du chargement du panier.");
      }
    });
  }

  private updateCartCount() {
    const count = Number(localStorage.getItem('cartCount')) || 0;
  
    localStorage.setItem("cartCount", String(count + 1));
  }
    

toggleCart() {
  this.isCartOpen = !this.isCartOpen;
}

///////////////////////////////////REVIEWS////////////////////////////////////////////////////////////////////////////////////
editingReview: ReviewProduct | null = null;  
reviews: ReviewProduct[] = [];
newReview: ReviewProduct =new ReviewProduct();
// isReviewModalOpen = false; 
showModalReview: boolean = false;
selectedReview: ReviewProduct | null = null;
 // Array de 5 étoiles pour afficher le système de rating
 stars: boolean[] = [false, false, false, false, false]; 



getReviews(): void {
    this.reviewService.getReviewByProductID(this.productId).subscribe(
      (reviews) => {
        this.reviews = reviews;
        this.loadUserDetails();
        
      },
      (error) => {
        console.error('Error fetching reviews', error);
      }
    );
  }

toggleReviewOptions(review: ReviewProduct): void {
  if (this.selectedReview === review) {
    this.selectedReview = null;
    this.editingReview = null;
  } else {
    this.selectedReview = review;
    this.editingReview = review;
  }
}
// setNewRating(rating: number) {
//   this.newReview.rating = rating;

//   for (let i = 0; i < this.stars.length; i++) {
//     this.stars[i] = i < rating;
//   }
// }
setNewRating(rating: number) {
  this.newReview.rating = rating;
}
hoveredNewRating = 0;
hoverNewRating(rating: number): void {
  this.hoveredNewRating = rating;
}

clearNewHover(): void {
  this.hoveredNewRating = 0;
}
setRating(rating: number): void {
  if (this.editingReview) {
    this.editingReview.rating = rating;
  }
}
hoveredRating: number = 0; 
hoverRating(rating: number): void {
  this.hoveredRating = rating;
}

// Fonction pour effacer l'effet de survol des étoiles
clearHover(): void {
  this.hoveredRating = 0;
}
startEditReview(review: ReviewProduct): void {
  this.editingReview = { ...review }; 
  this.selectedReview = review;        
}

  // Function to add a review using the ProductService
  addReview(): void {
    if (this.currentUser && this.product) {
      
      
      const reviewToSend: ReviewProduct = {
        idReview:this.newReview.idReview,
        content: this.newReview.content,
        rating: this.newReview.rating,
        email: this.currentUser.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: this.product // Envoyez l'objet complet
    };
      
      console.log(this.currentUser);
      
      this.reviewService.addReview( reviewToSend,this.product.idProduct).subscribe(
        (response) => {
          console.log('Review added successfully!', response);
         
         this.showModalReview = false; 
         
          this.getReviews();  
        },
        (error) => {
          console.error('Error adding review', error);
        }
      );
    } else {
      console.error('No user is logged in');
    }
  }
  saveEditedReview(): void {
    if (this.editingReview && this.editingReview.idReview) {
      this.editingReview.updatedAt = new Date();
      this.reviewService.updatereview( this.editingReview).subscribe(
        () => {
          this.getReviews();
          this.editingReview = null;
        },
        (error) => {
          console.error('Error updating review', error);
        }
      );
    }
  }
  
  
  deleteReview(reviewId: number): void {
    if (confirm('Are you sure you want to delete this review?')) {
        this.reviewService.deleteReview(reviewId).subscribe(
            (response) => {
                console.log('Review deleted successfully', response);
                this.getReviews(); // Rafraîchir les critiques après la suppression
            },
            (error) => {
                console.error('Error deleting review', error);
            }
        );
    }
}
cancelEdit(): void {
  this.editingReview = null;
}


     
}