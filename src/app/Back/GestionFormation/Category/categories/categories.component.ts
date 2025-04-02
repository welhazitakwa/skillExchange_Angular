import { Component } from '@angular/core';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AddEditCategoryComponent } from '../add-edit-category/add-edit-category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  constructor(private dialog: MatDialog, private catServ: CategoryService) {}
  listCategories: Category[] = [];

  ngOnInit() {
    this.getCategoriesList();
  }
  getCategoriesList() {
    this.catServ.getCategory().subscribe(
      (data) => (this.listCategories = data),
      (erreur) => console.log('erreur'),
      () => console.log(this.listCategories)
    );
  }

  deleteCategorie(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: 'Cette Catégorie va être supprimé définitivement! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-la!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.catServ.deleteCategory(id).subscribe({
          next: (res) => {
            Swal.fire(
              'Supprimé!',
              'Votre Catégorie a été supprimé.',
              'success'
            );
            this.getCategoriesList();
          },
          error: (err) => {
            Swal.fire(
              'Erreur!',
              'Une erreur est survenue lors de la suppression.',
              'error'
            );
          },
        });
      }
    });
  }
  openAddEditCatForm() {
    const dialogRef = this.dialog.open(AddEditCategoryComponent, {
      width: '550px',
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCategoriesList();
        }
      },
      error: console.log,
    });
  }
  // openEditCatForm(data: any) {
  //   const dialogRef = this.dialog.open(AddEditCategoryComponent, {
  //     data,
  //     width: '550px',
  //   });
  //   dialogRef.afterClosed().subscribe({
  //     next: (val) => {
  //       if (val) {
  //         this.getCategoriesList();
  //       }
  //     },
  //     error: console.log,
  //   });
  // }
}
