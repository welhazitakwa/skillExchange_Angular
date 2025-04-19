import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rating } from '../../models/GestionFormation/rating';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RatingCourseService {
  listRatings: Rating[] = [];
  constructor(private http: HttpClient) {}

  url = 'http://localhost:8084/skillExchange/ratingCourse';
  getRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(this.url + '/retrieve-all-rating');
  }
  addRating(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(this.url + '/add-rating', rating);
  }

  deleteRating(id: number) {
    return this.http.delete(this.url + '/remove-rating/' + id);
  }

  getRatingById(id: number) {
    return this.http.get<Rating>(this.url + '/retrieve-rating/' + id);
  }

  updateRating(rating: Rating) {
      return this.http.put(this.url + '/modify-rating', rating );
    }
 
}
