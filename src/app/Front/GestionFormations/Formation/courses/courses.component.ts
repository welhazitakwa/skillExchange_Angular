import { Component } from '@angular/core';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent {
  constructor(private catServ: CategoryService) {}
  listCategories: Category[] = [];

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
}
