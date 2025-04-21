import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-couses-by-category',
  templateUrl: './couses-by-category.component.html',
  styleUrls: ['./couses-by-category.component.css'],
})
export class CousesByCategoryComponent {
  constructor(private catServ: CategoryService,private formServ: FormationService, private router: Router) {}
  categoryId!: number;
  listFormations: Formation[] = [];
  @ViewChild('formationTableBody')
  categoryTableBodyRef!: ElementRef<HTMLTableSectionElement>;

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

   
  filterTable(searchText: string) {
    searchText = searchText.toLowerCase().trim();
    const tableBody = this.categoryTableBodyRef.nativeElement;

    if (tableBody) {
      const rows = tableBody.getElementsByTagName('tr');

      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let showRow = false;

        for (let j = 0; j < cells.length; j++) {
          const cellContent = cells[j].textContent || cells[j].innerText;
          if (cellContent.toLowerCase().indexOf(searchText) > -1) {
            showRow = true;
            break;
          }
        }

        rows[i].style.display = showRow ? '' : 'none';
      }
    }
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
            this.getCoursesOfCategory();
          },
          error: (err) => {
            Swal.fire('Error!', 'An error occurred while deleting.', 'error');
          },
        });
      }
    });
  }

 
}
