import { Injectable } from '@angular/core';
import { Formation } from '../../models/GestionFormation/formation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  listFormations: Formation[] = [];
  constructor(private http: HttpClient) {}

  url = 'http://localhost:8084/skillExchange/courses';
  getCourses(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.url + '/retrieve-all-courses');
  }
  addFormation(course: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.url + '/add-course', course);
  }

  deleteFormation(id: number) {
    return this.http.delete(this.url + '/remove-course/' + id);
  }

  getFormationById(id: number) {
    return this.http.get<Formation>(this.url + '/retrieve-course/' + id);
  }
  updateFormation(course: Formation) {
    return this.http.put(this.url + '/modify-course', course);
  }

  getCoursesByUserId(id: number): Observable<any> {
    return this.http.post(this.url + '/findById/', id);
  }
}
