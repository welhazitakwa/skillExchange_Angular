export interface Payment {
    idPaiement?: string;
    montant: number;
    datePaiement: Date;
    methodePaiement: PaymentMethod;
    statutPaiement: PaymentStatus;
    phoneNumber: string;
    transactionId : string;
    creditId : string;
    scheduleId : string;
  }
  
  export enum PaymentMethod {
    PAYPAL = 'PAYPAL',
    VISA = 'VISA',
    MASTERCARD = 'MASTERCARD',
    STRIPE = 'STRIPE'
  }
  
  export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}
