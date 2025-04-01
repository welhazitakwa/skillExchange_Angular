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
    return this.http.get<Category[]>(this.url);
  }
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.url, category);
  }

  deleteCategory(id: number) {
    return this.http.delete(this.url + '/' + id);
  }

  getCategoryById(id: number) {
    return this.http.get<Category>(this.url + '/' + id);
  }
  updateCategory(category: Category) {
    return this.http.put(this.url + '/' + category.id, category);
  }
}
