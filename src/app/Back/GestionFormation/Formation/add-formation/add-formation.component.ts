import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Formation } from 'src/app/core/models/GestionFormation/formation';
import { FormationService } from 'src/app/core/services/GestionFormation/formation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-formation',
  templateUrl: './add-formation.component.html',
  styleUrls: ['./add-formation.component.css']
})
export class AddFormationComponent {
  addForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', Validators.required),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(20),
      Validators.maxLength(50),
    ]),
    image: new FormControl(''), // Champ 'image' (aucune validation)
    status: new FormControl(''),
  });

  constructor(
    private formServ: FormationService,
    private Rout: Router,
    private diagRef: MatDialogRef<AddFormationComponent>
  ) {}
  // get name() {
  //   return this.addForm.get('name');
  // }

  // get address() {
  //   return this.addForm.get('address');
  // }

  F!: Formation;
  SaveCourse(F: FormGroup) {
    this.F = { ...F.value };
    console.log(this.F);
    this.formServ.addFormation(this.F).subscribe({
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
    Swal.fire(
      'Erreur!',
      "Une erreur est survenue lors de la d'ajout.",
      'error'
    );
  },

  complete: () => {
    console.log('Category added successfully');
    this.Rout.navigate(['/categories']);
  }
});

  }
  // SaveResidence(F: FormGroup) {
  //   this.F = { ...F.value };
  //   console.log(this.F);
  //   this.catServ.addCategory(this.F).subscribe(() => {
  //     // ***************************-------------*******************************
      
  //     // ***************************-------------*******************************


  //     console.log('Category added successfully');
  //     this.Rout.navigate(['/categories']);
  //   });
  // }
}
