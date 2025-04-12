import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/core/models/GestionFormation/category';
import { CategoryService } from 'src/app/core/services/GestionFormation/category.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
})
export class CoursesComponent {
  constructor(private catServ: CategoryService, private router: Router) {}
  listCategories: Category[] = [];
  searchText: string = '';
  filteredCategories: Category[] = [];
  ngOnInit() {
    this.getCategoriesList();
  }
  getCategoriesList() {
    this.catServ.getCategory().subscribe(
      (data) => {
        this.listCategories = data;
        this.filteredCategories = data;
      },
      (erreur) => console.log('erreur'),
      () => console.log(this.listCategories)
    );
  }
  getCoursesOfCateory(id: number) {
    // this.categorySelected.emit(id); // Émettre l'ID vers le composant parent
    //this.router.navigate(['/backcoursescat']);
    this.router.navigate(['/coursescat'], { state: { categoryId: id } });
  }

  filterTable(search: string) {
    this.searchText = search.toLowerCase().trim();
    this.filteredCategories = this.listCategories.filter((c) =>
      c.name.toLowerCase().includes(this.searchText)
    );
  }
}
