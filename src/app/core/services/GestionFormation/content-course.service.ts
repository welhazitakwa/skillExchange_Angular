import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContentCourse } from '../../models/GestionFormation/content-course';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentCourseService {
  url = 'http://localhost:8084/skillExchange/courseContent';

  constructor(private http: HttpClient) {}

  getContents(): Observable<ContentCourse[]> {
    return this.http.get<ContentCourse[]>(this.url + '/retrieve-all-contents');
  }
  addContent(content: ContentCourse): Observable<ContentCourse> {
    return this.http.post<ContentCourse>(this.url + '/add-content', content);
  }

  deleteContent(id: number) {
    return this.http.delete(this.url + '/remove-content/' + id);
  }

  getContentById(id: number) {
    return this.http.get<ContentCourse>(this.url + '/retrieve-content/' + id);
  }

  updateContent(content: ContentCourse) {
    return this.http.put(this.url + '/modify-Content', content);
  }

  getContentByCourseId(id: number): Observable<any> {
    return this.http.post(this.url + '/findById/', id);
  }
}
