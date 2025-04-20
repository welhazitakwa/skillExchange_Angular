import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Payment, PaymentMethod, PaymentStatus } from 'src/app/core/models/GestionProduit/payment';
import { PayementService } from 'src/app/core/services/GestionProduit/payement.service';
declare var paypal: any;
@Component({
  selector: 'app-paypal-payment',
  templateUrl: './paypal-payment.component.html',
  styleUrls: ['./paypal-payment.component.css']
})
export class PaypalPaymentComponent  implements OnInit, OnDestroy{
  payment: Payment = {
    transactionId: "",
    montant: 0,
    datePaiement: new Date(),
    methodePaiement: PaymentMethod.PAYPAL,
    statutPaiement: PaymentStatus.PENDING,
    phoneNumber: '',
    creditId :'',
    scheduleId:''
  };

  constructor(private paymentService: PayementService) {}
  @Input() schedule: any;
  async ngOnInit() {
    this.payment.montant = this.schedule.remainingAmount;
    this.payment.datePaiement = new Date();
    await this.loadPayPalScript();
  }

  ngOnDestroy() {
    this.cleanupPayPalScript();
  }

  private loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      if (window['paypal']) {
        this.initPayPalButton();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=Ae4E8HDB4L3HcqNGjyIa3harqjtU-MRmyEdFDwMjBN--BGYVcgszapVLykAdQogjr0RYV_CYNGLv7H1D&currency=USD`;
      script.id = 'paypal-script';
      script.onload = () => {
        this.initPayPalButton();
        resolve();
      };
      script.onerror = (err) => {
        console.error('Erreur de chargement du SDK PayPal:', err);
        reject(err);
      };
      document.body.appendChild(script);
    });
  }

  private cleanupPayPalScript() {
    const script = document.getElementById('paypal-script');
    if (script) {
      script.remove();
    }
  }

  private initPayPalButton() {
    try {
      paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal'
        },
        createOrder: (data: any, actions: any) => this.creerCommande(data, actions),
       // onApprove: (data: any, actions: any) => this.approuverPaiement(data, actions),
        onCancel: (data: any) => this.annulerPaiement(data),
        onError: (err: any) => this.gererErreur(err)
      }).render('#paypal-button-container');
    } catch (error) {
      console.error('Erreur initialisation bouton PayPal:', error);
    }
  }
  // private async approuverPaiement(data: any, actions: any) {
  //   try {
  //     const details = await actions.order.capture();
  //     console.log('Transaction complète:', details);

  //     this.payment.statutPaiement = PaymentStatus.COMPLETED;
  //     this.payment.transactionId = details.id;
  //     this.payment.creditId = this.schedule.creditId;     // Associe le crédit
  //     this.payment.scheduleId = this.schedule.id;          // Associe l’échéance si tu as un ID
  //     this.payment.phoneNumber = ''; // si tu veux l'utiliser ou le récupérer ailleurs

  //     this.paymentService.createPayment(this.payment).subscribe({
  //       next: (reponse) => this.gererSucces(reponse, details),
  //       error: (err) => this.gererErreurPaiement(err)
  //     });

  //   } catch (error) {
  //     this.gererErreurTraitement(error);
  //   }
  // }

  private creerCommande(data: any, actions: any) {
    const montant = this.schedule.remainingAmount;

    this.payment.montant = montant;
    this.payment.datePaiement = new Date();

    return actions.order.create({
      purchase_units: [{
        description: `Paiement échéance du ${this.schedule.dueDate}`,
        amount: {
          value: montant.toFixed(2), // format requis : string, 2 décimales
          currency_code: "USD"
        }
      }],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    });
  }
  

  private gererSucces(reponse: any, details: any) {
    alert(`Paiement réussi! ID: ${reponse.idPaiement}`);
    // Ajoutez ici toute logique post-paiement
  }

  private gererErreurPaiement(error: any) {
    console.error('Erreur enregistrement paiement:', error);
    this.payment.statutPaiement = PaymentStatus.FAILED;
    alert('Paiement traité mais erreur d\'enregistrement. Contactez le support.');
  }

  private gererErreurTraitement(error: any) {
    console.error('Erreur traitement paiement:', error);
    this.payment.statutPaiement = PaymentStatus.FAILED;
    alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
  }

  private annulerPaiement(data: any) {
    console.log('Paiement annulé:', data);
    this.payment.statutPaiement = PaymentStatus.FAILED;
    // Ajoutez ici toute logique spécifique d'annulation
  }

  private gererErreur(err: any) {
    console.error('Erreur PayPal:', err);
    this.payment.statutPaiement = PaymentStatus.FAILED;
    alert('Échec de l\'initialisation de PayPal. Actualisez ou essayez une autre méthode.');
  }
  ////////////////////end paypal et carte bancaire//////////////
  simulerPaiementFictif() {
    this.payment.transactionId = 'FAKE-' + new Date().getTime(); // ID fictif unique
    this.payment.statutPaiement = PaymentStatus.COMPLETED;
    this.payment.creditId = this.schedule.creditId;
    this.payment.scheduleId = this.schedule.id;
    this.payment.datePaiement = new Date();

    this.paymentService.createPayment2(this.payment).subscribe({
      next: (reponse) => this.gererSucces(reponse, { id: this.payment.transactionId }),
      error: (err) => this.gererErreurPaiement(err)
    });
  }


}
