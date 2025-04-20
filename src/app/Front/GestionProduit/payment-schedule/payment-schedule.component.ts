import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentSchedule } from 'src/app/core/models/GestionProduit/payment-schedule';
import { PayementService } from 'src/app/core/services/GestionProduit/payement.service';

@Component({
  selector: 'app-payment-schedule',
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.css']
})
export class PaymentScheduleComponent implements OnInit {
 showPaymentModal: boolean = false;
  
  paymentSchedules: any[] = [];
  
  creditId: string | null = null;

  constructor(
    private paymentService: PayementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID du crédit depuis l'URL
    this.creditId = this.route.snapshot.paramMap.get('creditId');
    console.log('Credit ID récupéré depuis l\'URL :', this.creditId);

    // Si un creditId est présent, récupérer les échéances de paiement
    // if (this.creditId) {
    //   this.paymentService.getPaymentSchedule(this.creditId).subscribe(
    //     (data) => {
    //       this.paymentSchedules = data;
    //       console.log('Échéancier reçu :', this.paymentSchedules);
    //     },
    //     (err) => {
    //       console.error('Erreur lors de la récupération de l’échéancier :', err);
    //     }
    //   );
    // }


  }
  suspiciousSchedules: string[] = [];
  detectFraudAutomatically(): void {
    // this.paymentService.detectFraud().subscribe({
    //   next: (res) => {
    //     this.suspiciousSchedules = res;
    //     console.log("⚠️ Suspicious behavior detected:", res);
    //   },
    //   error: (err) => {
    //     console.error("Erreur détection automatique fraude :", err);
    //   }
    // });
  }
  payer(schedule: any) {
    const montant = schedule.montantAPayer;

    if (!montant || montant <= 0) {
      alert("Veuillez entrer un montant valide.");
      return;
    }
    const paymentMethods = ['PAYPAL', 'VISA', 'MASTERCARD', 'STRIPE'];
    const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

  //   const payment = {
  //     montant: montant,
  //     datePaiement: new Date(),
  //     methodePaiement: randomMethod, // Tu peux le rendre dynamique
  //     statutPaiement: 'COMPLETED',
  //     phoneNumber: '0000000000', // Tu peux le récupérer du profil client
  //     creditId: this.creditId,
  //     scheduleId: schedule.id,
  //     typePaiement: 'PAIEMENT_CREDIT'
  //   };

  //   this.paymentService.createPayment(payment).subscribe({
  //     next: (res) => {
  //       alert("Paiement effectué avec succès !");
  //       console.log("Paiement enregistré :", res);
  //       // Mettre à jour les montants dans l’échéancier (facultatif)
  //       schedule.paidAmount += montant;
  //       schedule.remainingAmount -= montant;
  //       schedule.montantAPayer = 0;
  //       // tu peux aussi recharger les schedules si tu veux être plus précis
  //     },
  //     error: (err) => {
  //       console.error("Erreur lors du paiement :", err);
  //       alert("Une erreur est survenue pendant le paiement.");
  //     }
  //   });
  // }

}
}