import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
})
export class EditCategoryComponent {
  constructor(
    private actR: ActivatedRoute,
    private catService: CategoryService,
    private Rout: Router
  ) {}

  id!: number;
  category?: Category;
  updateForm = new FormGroup({
    id: new FormControl(0),
    // name: new FormControl(''),
    // address: new FormControl(''),
    // image: new FormControl(''),
    // status: new FormControl(''),
  });
  ngOnInit() {
    this.id = Number(this.actR.snapshot.paramMap.get('id'));
    this.catService.getCategoryById(this.id).subscribe((donne) => {
      this.category = donne;
      this.updateForm.patchValue(this.category);
    });
  }

  updateRes() {
    console.log(this.updateForm.value);

    const updatedCategory: Category = {
      ...this.updateForm.value,
      id: this.updateForm.value.id ?? 0, // Ensure id is a number
    } as Category;
    this.catService.updateCategory(updatedCategory).subscribe(() => {
      alert('Category updated successfully');
      this.Rout.navigate(['/categories']);
    });
  }
}
