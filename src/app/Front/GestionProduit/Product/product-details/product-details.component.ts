import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from 'src/app/core/models/GestionProduit/cart';
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

 
  productId!: number; 
  product: Product | undefined;
  reviews: ReviewProduct[] = [];
  newReview: ReviewProduct =new ReviewProduct();
  isReviewModalOpen = false; 
  currentUser: User | null = null;
  usersMap: { [key: number]: User } = {};
  cartProducts: CartProducts[] = [];
  cartId: number = 1;
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
  // Function to get product details
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

        
        
      },
      (error) => {
        console.error('Error fetching reviews', error);
      }
    );
  }
   /* getReviews(): void {
      this.reviewService.getReviewByProductID(this.productId).subscribe(
          (reviews) => {
              this.reviews = reviews;
              // Récupérer les infos des utilisateurs pour chaque review
              reviews.forEach(review => {
                  const userId = (review as any).userId; // Accès dynamique
                  if (userId) {
                      this.getUserInfo(userId);
                  }
              });
          },
          (error) => {
              console.error('Error fetching reviews', error);
          }
      );
  } */

  // Fonction pour récupérer les informations de l'utilisateur par userId
  getUserInfo(userId: number): void {
    if (!this.usersMap[userId]) {
      this.userService.getUserById(userId).subscribe(
        (user: User) => {
          this.usersMap[userId] = user;
        },
        (error) => {
          console.error('Error fetching user info', error);
        }
      );
    }
  }

  // Function to open the review modal
  openReviewModal() {
    this.isReviewModalOpen = true;
  }

  // Function to close the review modal
  closeReviewModal() {
    this.isReviewModalOpen = false;
  }

  // Function to add a review using the ProductService
  addReview(): void {
    if (this.currentUser && this.product) {
      
      this.newReview.createdAt = new Date();
      this.newReview.updatedAt = new Date();
      this.newReview.email=this.currentUser.email;
      this.newReview.product = this.product;
      
      console.log(this.currentUser);
      
      this.reviewService.addReview(this.newReview).subscribe(
        (response) => {
          console.log('Review added successfully!', response);
          this.isReviewModalOpen = false;  // Fermer le modal après la soumission
          this.getReviews();  // Rafraîchir la liste des avis
        },
        (error) => {
          console.error('Error adding review', error);
        }
      );
    } else {
      console.error('No user is logged in');
    }
  }


      toggleCart() {
        this.isCartOpen = !this.isCartOpen;
      }
      
}