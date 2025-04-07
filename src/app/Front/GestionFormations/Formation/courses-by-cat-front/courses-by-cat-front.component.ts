import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';

@Component({
  selector: 'app-courses-by-cat-front',
  templateUrl: './courses-by-cat-front.component.html',
  styleUrls: ['./courses-by-cat-front.component.css']
})
export class CoursesByCatFrontComponent {
constructor(private catServ: CategoryService,
  private formServ: FormationService, private router: Router) {}
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
      (data) => (this.listFormations = data),
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

   


  // deleteCourse(id: number) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'This Course will be permanently deleted! ',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'Cancel',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.formServ.deleteFormation(id).subscribe({
  //         next: (res) => {
  //           Swal.fire('Deleted!', 'Your Course has been deleted', 'success');
  //           this.getCoursesOfCategory();
  //         },
  //         error: (err) => {
  //           Swal.fire('Error!', 'An error occurred while deleting.', 'error');
  //         },
  //       });
  //     }
  //   });
  // }

}
