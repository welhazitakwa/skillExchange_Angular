import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import { AddCourseComponent } from '../add-course/add-course.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { EditCourseComponent } from '../edit-course/edit-course.component';

@Component({
  selector: 'app-user-course-space',
  templateUrl: './user-course-space.component.html',
  styleUrls: ['./user-course-space.component.css'],
})
export class UserCourseSpaceComponent {
  constructor(
    private catServ: CategoryService,
    private formServ: FormationService,
    private router: Router,
    private dialog: MatDialog
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
      (data) => (this.listFormations = data),
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
      data: { id: formId, userId:this.userId },
      width: '700px',
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
}
