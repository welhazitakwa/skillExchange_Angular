import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
})
export class EditCategoryComponent {
  constructor(
    private actR: ActivatedRoute,
    private catService: CategoryService,
    private Rout: Router,
    private dialogRef: MatDialogRef<EditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  id!: number;
  category?: Category;

  updateForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', Validators.required),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(50),
    ]),
    image: new FormControl('', Validators.required),
    imageType: new FormControl(''), 
    status: new FormControl<number | null>(null),
  });
  ngOnInit() {
    console.log('cccccccccccccccc');
    // if (this.data && this.data.id) {
    this.id = this.data.id;
    console.log('ID de la catégorie à modifier:', this.id);
    // Appelle ici le service pour récupérer la catégorie par ID
    // }
    // ****************************---------------------------************************
    this.catService.getCategoryById(this.id).subscribe((donne) => {
      this.category = donne;
      this.updateForm.patchValue(this.category);
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1]; // Extraire la partie base64
        this.updateForm.patchValue({
          image: base64, // Mise à jour du champ image en base64
          imageType: file.type, // Type de l'image
        });
      };
      reader.readAsDataURL(file); // Lire le fichier comme base64
    }
  }

  updateCategory() {
    console.log(this.updateForm.value);

    const updatedCategory: Category = {
      ...this.updateForm.value,
      id: this.updateForm.value.id ?? 0, // Ensure id is a number
    } as Category;
    this.catService.updateCategory(updatedCategory).subscribe({
      next: (val: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'The Category was modified successfully !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.dialogRef.close(true); // Vérifie que diagRef est bien défini
          }
        });
      },

      error: (err: any) => {
        Swal.fire(
          'Error!',
          'An error occurred while Editing the Category',
          'error'
        );
      },

      complete: () => {
        console.log('The Category was modified successfully');
        this.Rout.navigate(['/categories']);
      },
    });
  }
}
