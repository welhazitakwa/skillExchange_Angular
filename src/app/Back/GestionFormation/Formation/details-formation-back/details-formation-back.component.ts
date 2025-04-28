import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import { RatingCourseService } from 'src/app/core/services/GestionFormation/rating-course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details-formation-back',
  templateUrl: './details-formation-back.component.html',
  styleUrls: ['./details-formation-back.component.css'],
})
export class DetailsFormationBackComponent {
  id!: number;
  formation?: Formation;
  category?: Category;
  averageRating: number = 0;
  ratingCount: number = 0;

  constructor(
    private formServ: FormationService,
    private catServ: CategoryService,
    private ratingService: RatingCourseService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    //getFormationBy Id
    this.id = this.data.id;
    this.formServ.getFormationById(this.id).subscribe((donne) => {
      this.formation = donne;
      console.log('iiddd fooormmmm:' + this.formation.id);

      //getCategory By Id
      this.catServ
        .getCategoryById(this.formation.category.id)
        .subscribe((donne) => {
          this.category = donne;
          console.log('heddhii cat mel details : ' + this.category);
        });

      // Fetch average rating and count
      this.ratingService.getAverageRatingForCourse(this.id).subscribe(
        (avg) => {
          this.averageRating = avg;
        },
        (error) => {
          console.error(
            `Error fetching average rating for course ${this.id}:`,
            error
          );
          this.averageRating = 0;
        }
      );

      this.ratingService.getRatingCountForCourse(this.id).subscribe(
        (count) => {
          this.ratingCount = count;
        },
        (error) => {
          console.error(
            `Error fetching rating count for course ${this.id}:`,
            error
          );
          this.ratingCount = 0;
        }
      );
    });
  }

  convertDuration(duration: number): string {
    const hours = Math.floor(duration / 60); // Nombre d'heures
    const minutes = duration % 60; // Nombre de minutes restantes
    return `${hours}h ${minutes}min`;
  }

  shareCourse(): void {
    if (this.formation) {
      const courseDate = new Date(
        this.formation.date_ajout
      ).toLocaleDateString();
      const shareText = `${
        this.formation.title
      }\n\nDate Added: ${courseDate}\nDuration: ${
        this.formation.duration
      }\nApproval Status: ${
        this.formation.approoved === 0 ? 'Disapproved' : 'Approved'
      }\nState: ${this.formation.state === 0 ? 'Private' : 'Public'}`;

      if (navigator.share) {
        navigator
          .share({
            title: this.formation.title,
            text: shareText,
            url: window.location.href,
          })
          .catch((err) => {
            console.error('Erreur de partage:', err);
            this.copyToClipboard(shareText);
          });
      } else {
        this.copyToClipboard(shareText);
      }
    }
  }

  private copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        Swal.fire(
          'Success',
          'Course details have been copied to the clipboard!',
          'success'
        );
      })
      .catch((err) => {
        console.error('Erreur de copie:', err);
        Swal.fire(
          'Error',
          `Unable to copy details. Here is the information:\n\n${text}`,
          'error'
        );
      });
  }

  formatAverageRating(rating: number | undefined): string {
    if (rating === undefined || rating === 0) {
      return '0.00';
    }
    // Check if the rating is a whole number
    if (Math.floor(rating) === rating) {
      return rating.toString(); // No decimal for whole numbers (e.g., 3.0 -> '3')
    }
    // Show one decimal place for non-whole numbers (e.g., 2.5 -> '2.5')
    return rating.toFixed(2);
  }
  getEmoji(value: number): string {
    const emojis = ['😡', '😕', '😐', '🙂', '🤩'];
    return emojis[Math.max(0, Math.min(Math.round(value), 5)) - 1] || '';
  }
}

