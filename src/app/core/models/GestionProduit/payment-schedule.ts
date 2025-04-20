export class PaymentSchedule {
    id!: number;
    creditId: string;
  dueDate: string;
  dueAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
  lateInterest: number;     // <-- nouveau
  penaltyFee: number;       // <-- nouveau

  constructor(
    id: number,
    creditId: string,
    dueDate: string,
    dueAmount: number,
    paidAmount: number,
    remainingAmount: number,
    paymentStatus: string,
    lateInterest: number = 0,
    penaltyFee: number = 0
  ) {
    this.creditId = creditId;
    this.dueDate = dueDate;
    this.dueAmount = dueAmount;
    this.paidAmount = paidAmount;
    this.remainingAmount = remainingAmount;
    this.paymentStatus = paymentStatus;
    this.lateInterest = lateInterest;
    this.penaltyFee = penaltyFee;
  }
}
