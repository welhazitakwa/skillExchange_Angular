import { Injectable } from '@angular/core';
import { Formation } from '../../models/GestionFormation/formation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getFormationById(id: number): Observable<Formation> {
    return this.http.get<Formation>(`${this.url}/retrieve-course/${id}`).pipe(
      map((response: any) => ({
        ...response,
        quiz: response.quiz || null  // Ensure quiz object is properly mapped
      }))
    );
  }
  updateFormation(course: Formation) {
    return this.http.put(this.url + '/modify-course', course);
  }

  getCoursesByUserId(id: number): Observable<any> {
    return this.http.post(this.url + '/findById/', id);
  }
  approoveDiapproove(id: number) {
    return this.http.put(this.url + '/approoveDiapproove/', id);
  }

  getCoursesBySeason(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(
      this.url +'/stats/season'
    );
  }
}
