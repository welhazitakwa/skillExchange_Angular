import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartProducts } from 'src/app/core/models/GestionProduit/cart-products';
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
export class ProductDetailsComponent {
  
  isCartOpen = false;
  cartCount = 0; // À mettre à jour dynamiquement selon le panier

  editingReview: ReviewProduct | null = null;
  productId!: number; 
  product: Product | undefined;
  reviews: ReviewProduct[] = [];
  newReview: ReviewProduct =new ReviewProduct();
 // isReviewModalOpen = false; 
 showModalReview: boolean = false;
  currentUser: User | null = null;
  usersMap: { [key: string]: User } = {};
  cartProducts: CartProducts[] = [];
  cartId: number = 1;
  selectedReview: ReviewProduct | null = null;
  constructor(
    private productService: ProductService,
    private reviewService: ReviewProductService,
    private authService: AuthService,  
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private cartProductService:CartProductService,private cartService: CartService
  ) {}

  ngOnInit(): void {
    
    this.productId =Number(this.route.snapshot.paramMap.get('idProduct')) ; 
    this.getProductDetails();
    this.getReviews(); 
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
      },
      (error) => {
        console.error('Error fetching product details', error);
      }
    );
  }

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


      toggleCart() {
        this.isCartOpen = !this.isCartOpen;
      }
      
}