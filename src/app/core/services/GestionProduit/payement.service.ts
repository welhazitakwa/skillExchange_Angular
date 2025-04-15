import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../../models/GestionProduit/payment';
import { PaymentSchedule } from '../../models/GestionProduit/payment-schedule';

@Injectable({
  providedIn: 'root'
})
export class PayementService {
  url = 'http://localhost:8084/skillExchange/payements';
  constructor(private http: HttpClient) {}
  createPayment(payment: {
    montant: any;
    datePaiement: Date;
    methodePaiement: string;
    statutPaiement: string;
    phoneNumber: string;
    creditId: string | null;
    scheduleId: any;
    typePaiement: string
  }): Observable<Payment> {
    return this.http.post<Payment>(this.url, payment);
  }  createPayment2(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.url, payment);
  }

  getPaymentSchedule(creditId: string): Observable<PaymentSchedule[]> {
    return this.http.get<PaymentSchedule[]>(`http://localhost:8023/api/payments/schedule/${creditId}`);
  }

  // Créer un faux paiement
  enregistrerPaiement(payment: any): Observable<any> {
    return this.http.post('http://localhost:8024/api/payments/enregistrer', payment);
  }

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD';
      scriptElement.onload = () => resolve();
      scriptElement.onerror = () => reject();
      document.body.appendChild(scriptElement);
    });
  }

  detectFraud(): Observable<any> {
    return this.http.get(`${this.url}/detect`, { responseType: 'text' });
  }
  getPaymentSchedulesWithInfo(creditId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/payments/schedule/with-payments/${creditId}`);
  }
  

  // // 📊 Statistiques

  // // Temps moyen de paiement par client
  // getAverageDelayByClient(): Observable<{ [clientId: string]: number }> {
  //   return this.http.get<{ [clientId: string]: number }>(`${this.statsUrl}/average-delay`);
  // }

  // // Taux de retard
  // getLatePaymentRate(): Observable<number> {
  //   return this.http.get<number>(`${this.statsUrl}/late-rate`);
  // }

  // // Montant payé vs dû
  // getPaidVsDueAmounts(): Observable<{ paid: number, due: number }> {
  //   return this.http.get<{ paid: number, due: number }>(`${this.statsUrl}/paid-vs-due`);
  // }

}
