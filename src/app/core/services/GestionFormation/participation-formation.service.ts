import { Injectable } from '@angular/core';
import { ParticipationFormation } from '../../models/GestionFormation/participation-formation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipationFormationService {
  listParticipations: ParticipationFormation[] = [];
  constructor(private http: HttpClient) {}

  url = 'http://localhost:8084/skillExchange/participations';
  getParticipations(): Observable<ParticipationFormation[]> {
    return this.http.get<ParticipationFormation[]>(
      this.url + '/retrieve-all-participations'
    );
  }
  addParticipation(
    participation: ParticipationFormation
  ): Observable<ParticipationFormation> {
    return this.http.post<ParticipationFormation>(
      this.url + '/add-participation',
      participation
    );
  }

  deleteParticipation(id: number) {
    return this.http.delete(this.url + '/remove-participation/' + id);
  }

  getParticipationById(id: number) {
    return this.http.get<ParticipationFormation>(
      this.url + '/retrieve-participation/' + id
    );
  }
  updateFormation(participation: ParticipationFormation) {
    return this.http.put(this.url + '/modify-participation', participation);
  }

  getParticipationsByIdCourse(id: number): Observable<any> {
    return this.http.post(this.url + '/findById/', id);
  }

  checkParticipation(participantId: number, courseId: number) : Observable<boolean> {
    return this.http.get<boolean>(
      this.url+`/check?participantId=${participantId}&courseId=${courseId}`
    );
  }
assignQuizToParticipation(participationId: number, quizId: number): Observable<void> {
  return this.http.post<void>(
    `${this.url}/${participationId}/assign-quiz/${quizId}`, // Corrected with backticks
    null
  );
}
}
