import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/models/GestionFormation/category';
import Swal from 'sweetalert2';


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
    image: new FormControl(''), // Champ 'image' (aucune validation)
    status: new FormControl(''),
  });

  constructor(private catServ: CategoryService, private Rout: Router) {}
  // get name() {
  //   return this.addForm.get('name');
  // }

  // get address() {
  //   return this.addForm.get('address');
  // }

  C!: Category;
  SaveResidence(F: FormGroup) {
    this.C = { ...F.value };
    console.log(this.C);
    this.catServ.addCategory(this.C).subscribe(() => {
      console.log('Category added successfully');
      this.Rout.navigate(['/categories']);
    });
  }
}
