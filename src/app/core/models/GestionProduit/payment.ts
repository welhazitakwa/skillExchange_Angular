import { Cart } from "./cart";
import { CurrencyType } from "./currency-type";
import { ProductType } from "./product-type";

export class Payment {
    idPaiement?: string;
    montant?: number;
    datePaiement?: Date;
    methodePaiement?: PaymentMethod;
    statutPaiement?: PaymentStatus;
    //cart?:Cart; 
    cart?: Partial<Cart>;
    userEmail?:string;
    currencyType?:CurrencyType;
    productType?:ProductType;
  }
  
  export enum PaymentMethod {
    PAYPAL = 'PAYPAL',
    VISA = 'VISA',
    MASTERCARD = 'MASTERCARD',
    STRIPE = 'STRIPE',
     BALANCE = 'BALANCE'
  }
  
  export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED'
}
