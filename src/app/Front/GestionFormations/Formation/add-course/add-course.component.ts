import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
})
export class AddCourseComponent {
  userId!: number;
  categories: Category[] = [];

  addForm = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', Validators.required),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(50),
    ]),
    requiredSkills: new FormControl('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(50),
    ]),
    image: new FormControl(''),
    imageType: new FormControl(''),
    price: new FormControl(''),
    duration: new FormControl(''),
    state: new FormControl(''),
    author: new FormGroup({
      id: new FormControl(0),
    }),
    category_id: new FormControl(0), // juste l'id de la catégorie
    category: new FormGroup({
      id: new FormControl(0),
    }),
  });

  constructor(
    private formServ: FormationService,
    private catServ: CategoryService,
    private Rout: Router,
    private diagRef: MatDialogRef<AddCourseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    console.log('cccccccccccccccc');
    // if (this.data && this.data.id) {
    this.userId = this.data.userId;
    console.log('ID de user connecté:', this.userId);
    //
    this.addForm.patchValue({
      author: {
        id: this.userId,
      },
    });
    this.getCategoriesList();
  }

  getCategoriesList() {
    this.catServ.getCategory().subscribe(
      (data) => (this.categories = data),
      (erreur) => console.log('erreur'),
      () => console.log(this.categories)
    );
  }
  // get name() {
  //   return this.addForm.get('name');
  // }

  // get address() {
  //   return this.addForm.get('address');
  // }

  F!: Formation;
  SaveCourse(F: FormGroup) {
       let formData = { ...F.value };

       // S'assurer que la catégorie est envoyée correctement sous forme d'objet
       formData.category = { id: Number(formData.category_id) };

       // Supprimer category_id car ce champ n'est pas nécessaire dans l'objet envoyé
       delete formData.category_id;

       console.log('Données à envoyer :', formData);
    // this.F = { ...F.value };

    console.log(formData);
    this.formServ.addFormation(formData).subscribe({
      next: (val: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Course added successfully !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.diagRef.close(true); // Vérifie que diagRef est bien défini
          }
        });
      },

      error: (err: any) => {
        Swal.fire('Erreur!', 'An error occurred while Adding Course.', 'error');
      },

      complete: () => {
        console.log('Course added successfully');
        this.Rout.navigate(['/userCourseSpace']);
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
  onCategorySelect(event: any) {
    const selectedId = +event.target.value;
    if (!selectedId) return; // ignore si vide ou invalide
    this.addForm.patchValue({
      category: { id: selectedId },
    });
  }
}
