import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import { DetailsFormationComponent } from '../details-formation/details-formation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-courses-by-cat-front',
  templateUrl: './courses-by-cat-front.component.html',
  styleUrls: ['./courses-by-cat-front.component.css'],
})
export class CoursesByCatFrontComponent {
  searchText: string = '';
  filteredFormations: Formation[] = [];
  constructor(
    private catServ: CategoryService,
    private formServ: FormationService,
    private router: Router,
    private dialog: MatDialog
    
  ) {}
  categoryId!: number;
  listFormations: Formation[] = [];

  ngOnInit() {
    // Récupérer l'ID depuis l'état de la navigation
    const navigationState = history.state;
    if (navigationState && navigationState.categoryId) {
      this.categoryId = navigationState.categoryId;
      console.log('ID dans TestComponent:', this.categoryId); // Vérification dans la console
    }

    this.catServ.getCoursesOfCategorie(this.categoryId).subscribe(
      (data) => {this.listFormations = data; this.filteredFormations = data;},
      (erreur) => console.log('erreur'),
      () => console.log(this.listFormations)
    );
  }

  getCoursesOfCategory() {
    this.catServ.getCoursesOfCategorie(this.categoryId).subscribe(
      (data) => (this.listFormations = data),
      (erreur) => console.log('erreur'),
      () => console.log(this.listFormations)
    );
  }

  // ------------********************************************---------------------------
  // ------------********************************************---------------------------
  // ------------********************************************---------------------------

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

   openDetailsCourse(formId: number) {
      const dialogRef = this.dialog.open(DetailsFormationComponent, {
        data: { id: formId },
        //width: '1000px', 
      });
      dialogRef.afterClosed().subscribe({
        next: (val) => {
          if (val) {
            this.getCoursesOfCategory();
          }
        },
        error: console.log,
      });
    }
}
