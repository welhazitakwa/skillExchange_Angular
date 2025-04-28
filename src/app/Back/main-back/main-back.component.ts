import { Component } from '@angular/core';
import { AiProductService } from 'src/app/core/services/GestionProduit/ProductIA/ai-product.service';
import { ReviewProductService } from 'src/app/core/services/GestionProduit/review-product.service';

@Component({
  selector: 'app-main-back',
  templateUrl: './main-back.component.html',
  styleUrls: ['./main-back.component.css']
})
export class MainBackComponent {
  positiveReviews: number = 0;
  negativeReviews: number = 0;
  neutralReviews: number = 0;
   constructor(
      private aiProductService: AiProductService,  private reviewService: ReviewProductService
    ) { }
    ngOnInit(): void {
      this.loadAndAnalyzeReviews();
    }

    loadAndAnalyzeReviews() {
      this.reviewService.getReview().subscribe(reviews => {
        reviews.forEach(review => {
          if (review.content && review.content.length > 5) {
            this.aiProductService.analyzeReview(review.content).subscribe(response => {
              console.log('IA response for review:', review.content, response); 
              const sentiment = response.sentiment;
              if (sentiment === 'POSITIVE') {
                this.positiveReviews++;
              } else if (sentiment === 'NEGATIVE') {
                this.negativeReviews++;
              } else if (sentiment === 'NEUTRAL') {
                this.neutralReviews++;
              }
            }, error => {
              console.error('Error analyzing review', error);
            }); 
            // 👆 Ici la fermeture du .subscribe de analyzeReview()
          }
        });
      }, error => {
        console.error('Error loading reviews', error);
      });
    }
  }    
    


