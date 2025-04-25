import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentCourse } from 'src/app/core/models/GestionFormation/content-course';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { ContentCourseService } from 'src/app/core/services/GestionFormation/content-course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.css'],
})
export class EditContentComponent {
  constructor(
    private contentServ: ContentCourseService,
    private Rout: Router,
    private dialogRef: MatDialogRef<EditContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  id!: number;
  content?: ContentCourse;

  updateForm = new FormGroup({
     id: new FormControl(0),
     title: new FormControl('', Validators.required),
     description: new FormControl(''),
     order_affichage: new FormControl(0), // Champ 'image' (aucune validation)
     lnk_vid: new FormControl(''),
        course: new FormGroup({
          id: new FormControl(0),
        })
    // id: new FormControl(0),
    // name: new FormControl('', Validators.required),
    // description: new FormControl('', [
    //   Validators.required,
    //   Validators.minLength(20),
    //   Validators.maxLength(50),
    // ]),
    // image: new FormControl(''),
    // imageType: new FormControl(''), // Ajouté
    // status: new FormControl<number | null>(null),
  });
  ngOnInit() {
    console.log('cccccccccccccccc');
    // if (this.data && this.data.id) {
    this.id = this.data.id;
    console.log('ID de la catégorie à modifier:', this.id);
    // Appelle ici le service pour récupérer la catégorie par ID
    // }
    // ****************************---------------------------************************
    this.contentServ.getContentById(this.id).subscribe((donne) => {
      this.content = donne;
      this.updateForm.patchValue(this.content);
    });
  }

  EditContent() {
    console.log(this.updateForm.value);

    const updatedContent: ContentCourse = {
      ...this.updateForm.value,
      id: this.updateForm.value.id ?? 0, // Ensure id is a number
    } as ContentCourse;
    this.contentServ.updateContent(updatedContent).subscribe({
      next: (val: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'The Content was modified successfully !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.dialogRef.close(true); // Vérifie que diagRef est bien défini
          }
        });
      },

      error: (err: any) => {
        Swal.fire(
          'Error!',
          'An error occurred while Editing the Content',
          'error'
        );
      },
    });
  }
}
