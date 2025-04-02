import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificat } from 'src/app/core/models/QuestionQuizz/certificat';

@Injectable({
  providedIn: 'root'
})
export class CertificatService {
  private apiUrl = 'http://localhost:8084/skillExchange/api/certificats';

  constructor(private http: HttpClient) {}

  getAllCertificats(): Observable<Certificat[]> {
    return this.http.get<Certificat[]>(this.apiUrl);
  }

  getCertificatById(id: number): Observable<Certificat> {
    return this.http.get<Certificat>(`${this.apiUrl}/${id}`);
  }

  createCertificat(certificat: Certificat): Observable<Certificat> {
    return this.http.post<Certificat>(this.apiUrl, certificat);
  }

  updateCertificat(id: number, certificat: Certificat): Observable<Certificat> {
    return this.http.put<Certificat>(`${this.apiUrl}/${id}`, certificat);
  }

  deleteCertificat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
