import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentSelection } from '../../models/GestionFormation/content-selection';

@Injectable({
  providedIn: 'root',
})
export class ContentSelectionService {
  url = 'http://localhost:8084/skillExchange/selectionContent';

  constructor(private http: HttpClient) {}

  getSelections(): Observable<ContentSelection[]> {
    return this.http.get<ContentSelection[]>(
      this.url + '/retrieve-all-selection'
    );
  }
  addSelection(selection: ContentSelection): Observable<ContentSelection> {
    return this.http.post<ContentSelection>(
      this.url + '/add-selection',
      selection
    );
  }

  deleteSelection(id: number) {
    return this.http.delete(this.url + '/remove-selection/' + id);
  }

  getSelectionById(id: number) {
    return this.http.get<ContentSelection>(
      this.url + '/retrieve-content/' + id
    );
  }

  getUserSelections(id: number): Observable<any> {
    return this.http.get<ContentSelection[]>(this.url + '/user/' + id);
  }
  getSelectionByUserAndContent(userId: number, contentCurseId: number): Observable<any> {
    return this.http.get<ContentSelection[]>
    (this.url + '/user/' + userId + '/content/' + contentCurseId);
  }
}
