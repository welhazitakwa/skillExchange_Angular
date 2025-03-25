import { Component } from '@angular/core';
import { ReviewProduct } from 'src/app/core/models/GestionProduit/review-product';
import { ReviewProductService } from 'src/app/core/services/GestionProduit/review-product.service';

@Component({
  selector: 'app-all-reviews',
  templateUrl: './all-reviews.component.html',
  styleUrls: ['./all-reviews.component.css']
})
export class AllReviewsComponent {
  reviews: ReviewProduct[] = [];

  constructor(private reviewService: ReviewProductService) {}

  ngOnInit(){
    this.reviewService.getReview().subscribe(
      data => this.reviews=data,
      erreur =>console.log("erreur"),
      ()=>console.log("le chargement des produits  est terminés ")
      
     );
  }
}
