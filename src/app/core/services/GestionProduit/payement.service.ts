import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from '../../models/GestionProduit/payment';
import { Cart } from '../../models/GestionProduit/cart';

@Injectable({
  providedIn: 'root'
})
export class PayementService {
  url = 'http://localhost:8084/skillExchange/api';
  constructor(private http: HttpClient) {}
 
  createPayment2(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.url, payment);
  }
  // createStripeSession(amount: number, productName: string): Observable<string> {
  //   return this.http.post(`${this.url}/stripe-session?amount=${amount}&productName=${productName}`, {}, { responseType: 'text' });
  // }
  createStripeSession(amount: number, cartId:number): Observable<string> {
    return this.http.post(`${this.url}/payments/stripe-session?amount=${amount}&cartId=${cartId}`, {}, { responseType: 'text' });
  }

  createPayPalPayment(amount: number, currency: string, description: string): Observable<string> {
    const url = `/api/paypal/create`; // adapte l'URL à ton backend
    const params = new HttpParams()
      .set('amount', amount.toString())
      .set('currency', currency)
      .set('description', description);
  
    return this.http.post(url, null, { params, responseType: 'text' });
  }
  

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Évite de charger plusieurs fois
      if (document.getElementById('paypal-sdk')) {
        resolve();
        return;
      }
  
      const scriptElement = document.createElement('script');
      scriptElement.id = 'paypal-sdk'; // ✅ pour éviter les doublons
      scriptElement.src = 'https://www.paypal.com/sdk/js?client-id=AQgP1txB3rkh5U1Tb_7RHytsAQ6qJ_tPZKKkDMFivbiiZ4ppsKMQ4M0EuwY8qpzZ_ZMF699mXRHenUM5&currency=USD';
      scriptElement.onload = () => resolve();
      scriptElement.onerror = () => reject();
  
      document.body.appendChild(scriptElement);
    });
  }
  notifyPaypalSuccess(data: {
    userEmail: string;
    cartId: number;
    montant: number;
    transactionId: string;
  }): Observable<any> {
    return this.http.post('http://localhost:8084/skillExchange/api/paypal/success', data);
  }
  
  
/*
  detectFraud(): Observable<any> {
    return this.http.get(`${this.url}/detect`, { responseType: 'text' });
  }
  getPaymentSchedulesWithInfo(creditId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/payments/schedule/with-payments/${creditId}`);
  }*/
  

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
