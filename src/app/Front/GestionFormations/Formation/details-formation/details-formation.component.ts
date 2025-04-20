import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import { RatingCourseService } from 'src/app/core/services/GestionFormation/rating-course.service';

@Component({
  selector: 'app-details-formation',
  templateUrl: './details-formation.component.html',
  styleUrls: ['./details-formation.component.css'],
})
export class DetailsFormationComponent {
  id!: number;
  formation?: Formation;
  category?: Category;
  averageRating: number = 0;
  ratingCount: number = 0;

  constructor(
    private actR: ActivatedRoute,
    private formServ: FormationService,
    private catServ: CategoryService,
    private Rout: Router,
    private ratingService: RatingCourseService, // Add RatingCourseService
    private dialogRef: MatDialogRef<DetailsFormationComponent>,
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
  }

  formatAverageRating(rating: number | undefined): string {
    if (rating === undefined || rating === 0) {
      return '0';
    }
    if (Math.floor(rating) === rating) {
      return rating.toString();
    }
    return rating.toFixed(1);
  }
  getEmoji(value: number): string {
    const emojis = ['😡', '😕', '😐', '🙂', '🤩'];
    return emojis[Math.max(0, Math.min(Math.round(value), 5)) - 1] || '';
  }
  convertDuration(duration: number): string {
    const hours = Math.floor(duration / 60); // Nombre d'heures
    const minutes = duration % 60; // Nombre de minutes restantes
    return `${hours}h ${minutes}min`;
  }
}
