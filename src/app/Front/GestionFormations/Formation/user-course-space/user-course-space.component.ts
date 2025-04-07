import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import { AddCourseComponent } from '../add-course/add-course.component';
import { MatDialog } from '@angular/material/dialog';

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

  convertDuration(duration: number): string {
    const hours = Math.floor(duration / 60); // Nombre d'heures
    const minutes = duration % 60; // Nombre de minutes restantes
    return `${hours}h ${minutes}min`;
  }
}
