import { Component } from '@angular/core';
import { Payment } from 'src/app/core/models/GestionProduit/payment';
import { PayementService } from 'src/app/core/services/GestionProduit/payement.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  payment: Payment = new Payment();

  constructor(private payService: PayementService) {}
  payerAvecStripe(): void {
    const amount = this.payment.montant;
    const cartId = this.payment.cart?.id;
  
    if (!amount || !cartId) {
      alert("Montant ou panier non défini.");
      return;
    }
  
    this.payService.createStripeSession(amount, cartId).subscribe(
      (sessionUrl: string) => {
        window.location.href = sessionUrl;
      },
      error => {
        console.error('Erreur Stripe:', error);
      }
    );
  }
  

}
