import { Injectable } from '@angular/core';
import { PaiementFormation } from '../../models/GestionFormation/paiement-formation';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaiementFormationService {
  listPaiemants: PaiementFormation[] = [];
  constructor(private http: HttpClient) {}

  url = 'http://localhost:8084/skillExchange/paiement-course';
  getPaiements(): Observable<PaiementFormation[]> {
    return this.http.get<PaiementFormation[]>(
      this.url + '/retrieve-all-paiements'
    );
  }
  addPaiement(paiement: PaiementFormation): Observable<PaiementFormation> {
    return this.http.post<PaiementFormation>(
      this.url + '/add-paiement',
      paiement
    );
  }

  deletePaiement(id: number) {
    return this.http.delete(this.url + '/remove-paiement/' + id);
  }

  getPaiementById(id: number) {
    return this.http.get<PaiementFormation>(
      this.url + '/retrieve-paiement/' + id
    );
  }
  checkPaiement(
    participantId: number,
    courseId: number
  ): Observable<boolean> {
    return this.http.get<boolean>(
      this.url + `/check?participantId=${participantId}&courseId=${courseId}`
    );
  }
}
