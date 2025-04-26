import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyType } from 'src/app/core/models/GestionProduit/currency-type';
import { Payment, PaymentMethod } from 'src/app/core/models/GestionProduit/payment';
import { PayementService } from 'src/app/core/services/GestionProduit/payement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent  implements OnInit{
 
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private paymentService: PayementService
  ) {}

  // ngOnInit(): void {
  //   const userEmail = localStorage.getItem('userEmail') || 'default@example.com';
  //   const cartId = Number(localStorage.getItem('cartId') ?? 0);
  //   const montant = Number(localStorage.getItem('amount') ?? 0);

  //   console.log('📤 LocalStorage userEmail:', userEmail);
  //   console.log('📤 LocalStorage cartId:', cartId);
  //   console.log('📤 LocalStorage montant:', montant);
  
  //   if (!userEmail || !cartId || !montant) {
  //     console.warn("❌ Données manquantes pour enregistrer le paiement Stripe");
  //     return;
  //   }
  
  //   const payment: Payment = {
  //     userEmail: userEmail,
  //     montant: montant,
  //     methodePaiement: PaymentMethod.STRIPE,
  //     cart: { id: cartId }
  //   };
  
  //   this.paymentService.createPayment2(payment).subscribe({
  //     next: (res) => console.log('✅ Paiement Stripe enregistré', res),
  //     error: (err) => console.error('❌ Erreur lors de l’enregistrement Stripe', err)
  //   });
  // }
  paymentIntentId: string = '';
  //ngOnInit(): void {
   /* this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];
      if (!sessionId) {
        console.warn("⚠️ Aucun session_id fourni.");
        return;
      }

      this.http.get<any>(`http://localhost:8084/skillExchange/api/payments/stripe/session-info?sessionId=${sessionId}`)
        .subscribe(session => {
          const email = session.customer_details?.email;
          const amount = session.amount_total / 100; // Stripe = cents
          const cartId = Number(session.metadata?.cartId);
          const currencyType = session.metadata?.currencyType;

          const payment: Payment = {
            userEmail: email,
            montant: amount,
            methodePaiement: PaymentMethod.STRIPE,
            currencyType: CurrencyType[currencyType as keyof typeof CurrencyType],
            //currencyType: CurrencyType.TND, 
            cart: { id: cartId }
          };

          console.log("📤 Enregistrement paiement Stripe :", payment);

          this.paymentService.createPayment2(payment).subscribe({
            next: (res) =>{ console.log("✅ Paiement enregistré en base"),
            alert("📧 Facture envoyée par mail !");},
            error: err => console.error("❌ Erreur enregistrement :", err)
          });
        });
    });}*/ 
    ngOnInit(): void {
      this.route.queryParams.subscribe((params) => {
        const sessionId = params['session_id'];
    
        if (!sessionId) {
          console.warn("⚠️ Aucun session_id trouvé dans l’URL.");
          return;
        }
    
        this.paymentService.getStripeSessionInfo(sessionId).subscribe({
          next: (session) => {
            console.log('✅ Session Stripe récupérée:', session);
    
            const email = session.customer_details?.email || 'unknown@example.com';
            const amount = session.amount_total / 100;
            const cartId = Number(session.metadata?.cartId || 0);
            const currencyStr = session.metadata?.currencyType || 'USD';
            const currencyType = CurrencyType[currencyStr as keyof typeof CurrencyType];
    
            const paymentIntentId = session.payment_intent;
    
            const payment: Payment = {
              userEmail: email,
              montant: amount,
              methodePaiement: PaymentMethod.STRIPE,
              currencyType: currencyType,
              cart: { id: cartId }
            };
    
            console.log("📤 Enregistrement du paiement :", payment);
    
            this.paymentService.createPayment2(payment).subscribe({
              next: (res) => {
                console.log("✅ Payment successfully recorded !");
                alert("📧 Votre facture vous a été envoyée par e-mail.");
                Swal.fire({
                  icon: 'success',
                  title: 'Payment Confirmed',
                  text: '📧 Your invoice has been sent to your email.',
                  confirmButtonColor: '#f97316'
                });
              
              
                if (paymentIntentId) {
                  this.paymentService.downloadStripeInvoice(paymentIntentId);
                }
              },
              error: (err) => {
                console.error("❌ Error:", err);
                Swal.fire({
                  icon: 'error',
                  title: 'Oops!',
                  text: 'Something went wrong during payment.',
                  confirmButtonColor: '#d33'
                });
              }
            
            });
          },
          error: (err) => {
            console.error("❌ Erreur de récupération de la session Stripe :", err);
          }
        });
      });
    }
  }    


