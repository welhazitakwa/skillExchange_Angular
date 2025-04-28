import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/models/GestionFormation/category';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.css'],
})
export class AddEditCategoryComponent {
  addForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', Validators.required),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(50),
    ]),
    image: new FormControl('', Validators.required), // image en base64
    imageType: new FormControl(''), // Champ 'image' (aucune validation)
    status: new FormControl('', [Validators.required]),
  });

  constructor(
    private catServ: CategoryService,
    private Rout: Router,
    private diagRef: MatDialogRef<AddEditCategoryComponent>
  ) {}

  C!: Category;
  SaveCategory(F: FormGroup) {
    this.C = { ...F.value };
    console.log(this.C);
    this.catServ.addCategory(this.C).subscribe({
      next: (val: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Category added successfully !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.diagRef.close(true); // Vérifie que diagRef est bien défini
          }
        });
      },

      error: (err: any) => {
        Swal.fire(
          'Erreur!',
          'An error occurred while Adding the Category',
          'error'
        );
      },

      complete: () => {
        console.log('Category added successfully');
        this.Rout.navigate(['/categories']);
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.addForm.patchValue({
          image: base64,
          imageType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
