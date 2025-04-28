import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EditCategoryComponent } from 'src/app/Back/GestionFormation/Category/edit-category/edit-category.component';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css'],
})
export class EditCourseComponent {
  id!: number;
  userId!: number;
  categories: Category[] = [];
  formation?: Formation;

  updateForm = new FormGroup({
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
    image: new FormControl('', Validators.required),
    imageType: new FormControl(''),
    price: new FormControl<number | null>(null, Validators.required),
    date_ajout: new FormControl(),
    duration: new FormControl<number | null>(null, Validators.required),
    state: new FormControl<number | null>(null, Validators.required),
    author: new FormGroup({
      id: new FormControl(0),
    }),
    category_id: new FormControl<number | null>(0), // juste l'id de la catégorie
    category: new FormGroup({
      id: new FormControl(0),
    }),
  });
  constructor(
    private actR: ActivatedRoute,
    private formServ: FormationService,
    private catServ: CategoryService,
    private Rout: Router,
    private dialogRef: MatDialogRef<EditCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.id = this.data.id;
    this.userId = this.data.userId;

    this.formServ.getFormationById(this.id).subscribe((formation) => {
      this.formation = formation;

      // On pré-remplit les autres champs sans toucher à category_id
      this.updateForm.patchValue({
        ...formation,
        author: { id: this.userId },
      });

      // Maintenant on charge les catégories
      this.catServ.getCategory().subscribe((data) => {
        this.categories = data.filter((c) => c.status === 1);

        // Et là on peut patcher category_id quand on est sûr qu'il existe dans la liste
        const categoryId = this.formation?.category?.id ?? null;
        this.updateForm.get('category_id')?.setValue(categoryId);
      });
    });
  }

  // getCategoriesList() {
  //   this.catServ.getCategory().subscribe(
  //     (data) => (this.categories = data.filter((c) => c.status === 1)),
  //     (erreur) => console.log('erreur'),
  //     () => console.log(this.categories)
  //   );
  // }

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

  updateCourse() {
    console.log(this.updateForm.value);
    // Utilise soit la valeur sélectionnée, soit celle déjà enregistrée

    let formData = this.updateForm.value;
    const categoryId = formData.category_id || this.formation?.category?.id;
    formData.category = { id: Number(categoryId) };
    delete formData.category_id;

    // S'assurer que la catégorie est envoyée correctement sous forme d'objet
    //   formData.category = { id: Number(formData.category_id) };

    // Supprimer category_id car ce champ n'est pas nécessaire dans l'objet envoyé
    delete formData.category_id;

    console.log('Données à envoyer :', formData);
    // this.F = { ...F.value };

    console.log(formData);
    const updatedFormation: Formation = {
      ...this.updateForm.value,
      id: this.updateForm.value.id ?? 0, // Ensure id is a number
    } as Formation;
    this.formServ.updateFormation(updatedFormation).subscribe({
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
        this.Rout.navigate(['/userCourseSpace']);
      },
    });
  }
}
