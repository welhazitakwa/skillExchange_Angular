import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import { AddCourseComponent } from '../add-course/add-course.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { EditCourseComponent } from '../edit-course/edit-course.component';
import { DetailsFormationComponent } from '../details-formation/details-formation.component';
import { ParticipationFormation } from 'src/app/core/models/GestionFormation/participation-formation';
import { ParticipationFormationService } from 'src/app/core/services/GestionFormation/participation-formation.service';
import { RatingCourseService } from 'src/app/core/services/GestionFormation/rating-course.service';

@Component({
  selector: 'app-user-course-space',
  templateUrl: './user-course-space.component.html',
  styleUrls: ['./user-course-space.component.css'],
})
export class UserCourseSpaceComponent {
  // @ViewChild('formationTableBody')
  // formationCardBodyRef!: ElementRef<HTMLInputElement>;
  searchText: string = '';
  filteredFormations: Formation[] = [];
  totalProgress: number = 0; // total inscriptions
  listParticipation: ParticipationFormation[] = [];
  totalParticipantsMap: { [courseId: number]: number } = {};
  ratingMap: { [courseId: number]: number } = {}; // Store ratings for each course
  averageRatingMap: { [courseId: number]: number } = {}; // Store average ratings
  ratingCountMap: { [courseId: number]: number } = {}; // Store rating counts

  constructor(
    private formServ: FormationService,
    private router: Router,
    private dialog: MatDialog,
    private participationServ: ParticipationFormationService,
    private ratingService: RatingCourseService // Add this
  ) {}
  userId!: number;
  listFormations: Formation[] = [];

  ngOnInit() {
    // Récupérer l'ID depuis l'état de la navigation
    const navigationState = history.state;
    if (navigationState && navigationState.userId) {
      this.userId = navigationState.userId;
      console.log('ID dans TestComponent:', this.userId); // Vérification dans la console
    }
    this.getFormationsList();
  }
  getFormationsList() {
    this.formServ.getCoursesByUserId(this.userId).subscribe(
      (data) => {
        this.listFormations = data;
        this.filteredFormations = data;
        // ahahahahahahahahahahahahahahaha
        this.filteredFormations.forEach((f) => {
          this.ratingService.getAverageRatingForCourse(f.id).subscribe(
            (avg) => {
              this.averageRatingMap[f.id] = Number(avg.toFixed(1)); // Round to 1 decimal place
            },
            (error) => {
              console.error(
                `Error fetching average rating for course ${f.id}:`,
                error
              );
              this.averageRatingMap[f.id] = 0;
            }
          );

          // Fetch rating count
          this.ratingService.getRatingCountForCourse(f.id).subscribe(
            (count) => {
              this.ratingCountMap[f.id] = count;
            },
            (error) => {
              console.error(
                `Error fetching rating count for course ${f.id}:`,
                error
              );
              this.ratingCountMap[f.id] = 0;
            }
          );

         this.participationServ.getParticipationsByIdCourse(f.id).subscribe(
           (data) => {
             this.listParticipation = data;
             // Store the number of participation rows (students)
             this.totalParticipantsMap[f.id] = this.listParticipation.length;
           },
           (erreur) => {
             console.error(
               `Error fetching participations for course ${f.id}:`,
               erreur
             );
             this.totalParticipantsMap[f.id] = 0; // Fallback value
           },
           () => console.log(this.listParticipation)
         );

          // Fetch payment and participation status
        });
        // ahahahahahahahahahahahahahahaha
      },
      (erreur) => console.log('erreur'),
      () => console.log(this.listFormations)
    );
  }

  openAddCourseForm() {
    const dialogRef = this.dialog.open(AddCourseComponent, {
      width: '700px',
      data: { userId: this.userId },
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getFormationsList();
        }
      },
      error: console.log,
    });
  }

  deleteCourse(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This Course will be permanently deleted! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.formServ.deleteFormation(id).subscribe({
          next: (res) => {
            Swal.fire('Deleted!', 'Your Course has been deleted', 'success');
            this.getFormationsList();
          },
          error: (err) => {
            Swal.fire('Error!', 'An error occurred while deleting.', 'error');
          },
        });
      }
    });
  }

  openEditCourseForm(formId: number) {
    const dialogRef = this.dialog.open(EditCourseComponent, {
      data: { id: formId, userId: this.userId },
      width: '850px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getFormationsList();
        }
      },
      error: console.log,
    });
  }
  openDetailsCourse(formId: number) {
    const dialogRef = this.dialog.open(DetailsFormationComponent, {
      data: { id: formId },
      //width: '1000px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getFormationsList();
        }
      },
      error: console.log,
    });
  }
  convertDuration(duration: number): string {
    const hours = Math.floor(duration / 60); // Nombre d'heures
    const minutes = duration % 60; // Nombre de minutes restantes
    return `${hours}h ${minutes}min`;
  }
  filterTable(search: string) {
    this.searchText = search.toLowerCase().trim();
    this.filteredFormations = this.listFormations.filter((f) =>
      (f.title + f.price + f.duration).toLowerCase().includes(this.searchText)
    );
  }
  AssignCourseToFormation(idFormation: number) {
    this.router.navigate(['/ContentList'], {
      state: { formationId: idFormation },
    });
  }
}
