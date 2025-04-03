import { Injectable } from '@angular/core';
import { Category } from '../../models/GestionFormation/category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  listCategories: Category[] = [];
  constructor(private http: HttpClient) {}

  url = 'http://localhost:8084/skillExchange/category';
  getCategory(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url + '/retrieve-all-categories');
  }
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.url + '/add-category', category);
  }

  deleteCategory(id: number) {
    return this.http.delete(this.url + '/remove-category/' + id);
  }

  getCategoryById(id: number) {
    return this.http.get<Category>(this.url + '/retrieve-category/' + id);
  }
  updateCategory(category: Category) {
    return this.http.put(
      this.url + '/modify-category', category);
  }

  // editCategorie(id: number, data: any): Observable<any> {
  //   return this.http.put(`http://localhost:8081/categorie/${id}`, data);
  // }
}
