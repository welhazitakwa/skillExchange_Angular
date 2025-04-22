import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentCourse } from 'src/app/core/models/GestionFormation/content-course';
import { ContentCourseService } from 'src/app/core/services/GestionFormation/content-course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.css'],
})
export class AddContentComponent {
  formationId!: number;
  addForm = new FormGroup({
    id: new FormControl(0),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    // contentType: new FormControl(''), // image en base64
    order_affichage: new FormControl(''), // Champ 'image' (aucune validation)
    lnk_vid: new FormControl(''),
    course: new FormGroup({
      id: new FormControl(0),
    }),
  });

  constructor(
    private contentCourseService: ContentCourseService,
    private Rout: Router,
    private diagRef: MatDialogRef<AddContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formationId = this.data.id;
    this.addForm.patchValue({
      course: {
        id: this.formationId,
      },
    });
  }
  C!: ContentCourse;
  SaveContent(F: FormGroup) {
    this.C = { ...F.value };
    console.log(this.C);
    this.contentCourseService.addContent(this.C).subscribe({
      next: (val: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Content added successfully !',
        }).then((result) => {
          if (result.isConfirmed) {
            this.diagRef.close(true); // Vérifie que diagRef est bien défini
          }
        });
      },

      error: (err: any) => {
        Swal.fire(
          'Erreur!',
          'An error occurred while Adding the Content',
          'error'
        );
      },
    });
  }
}

