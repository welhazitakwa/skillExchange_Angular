import { Component, ElementRef, ViewChild } from '@angular/core';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AddEditCategoryComponent } from '../add-edit-category/add-edit-category.component';
import { EditCategoryComponent } from '../edit-category/edit-category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  constructor(private dialog: MatDialog, private catServ: CategoryService) {}
  listCategories: Category[] = [];
  @ViewChild('categoryTableBody')
  categoryTableBodyRef!: ElementRef<HTMLTableSectionElement>;

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
      title: 'Are you sure?',
      text: 'This category will be permanently deleted! ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.catServ.deleteCategory(id).subscribe({
          next: (res) => {
            Swal.fire('Deleted!', 'Your category has been deleted', 'success');
            this.getCategoriesList();
          },
          error: (err) => {
            Swal.fire('Error!', 'An error occurred while deleting.', 'error');
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
  openEditCatForm(catId: number) {
    const dialogRef = this.dialog.open(EditCategoryComponent, {
      data: { id: catId },
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

  ngAfterViewInit() {
    // Exécuter filterTable une fois que la vue est initialisée pour éviter les erreurs de 'null'
    this.filterTable('');
  }
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
}
