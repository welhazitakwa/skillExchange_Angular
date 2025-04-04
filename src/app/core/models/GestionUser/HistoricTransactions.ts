export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
}

export class HistoricTransactions {
  id!: number | null;
  type!: TransactionType;
  amount!: number;
  date!: Date;
  description!: String;
}
