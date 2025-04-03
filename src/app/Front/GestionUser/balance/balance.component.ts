import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  HistoricTransactions,
  TransactionType,
} from 'src/app/core/models/GestionUser/HistoricTransactions';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent {
  currentUser: User | null = null;
  activeSection: TransactionType.TRANSFER | TransactionType.WITHDRAWAL | null =
    null;
  transactionAmount: number = 0;
  recipientEmail: string = '';
  transactionDescription: string = '';
  transactions: HistoricTransactions[] = [];
  public TransactionType = TransactionType;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    console.log(currentUserEmail);
    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user: User) => {
        this.currentUser = user;
        if (user.historicTransactions)
          this.transactions = user.historicTransactions.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  showSection(section: TransactionType.TRANSFER | TransactionType.WITHDRAWAL) {
    this.activeSection = this.activeSection === section ? null : section;
  }

  submitTransaction() {
    if (
      !this.activeSection ||
      !this.transactionAmount ||
      this.transactionAmount <= 0
    ) {
      alert('Please select a transaction type and enter a valid amount');
      return;
    }

    if (
      this.activeSection === TransactionType.TRANSFER &&
      !this.recipientEmail
    ) {
      alert('Please enter recipient email for transfer');
      return;
    }

    const transactionData = {
      type: this.activeSection,
      amount: this.transactionAmount,
      recipientEmail: this.recipientEmail,
      description:
        this.transactionDescription || `${this.activeSection} transaction`,
    };

    console.log('Submitting transaction:', transactionData);

    if (this.activeSection === TransactionType.TRANSFER) {
      this.handleTransfer();
    } else if (this.activeSection === TransactionType.WITHDRAWAL) {
      this.handleWithdrawal();
    }
  }

  private handleTransfer() {
    if (this.recipientEmail === this.currentUser?.email) {
      alert('Cannot transfer to yourself');
      return;
    }
    if ((this.currentUser?.balance ?? 0) < this.transactionAmount) {
      alert('Insufficient balance for transfer');
      return;
    }
    this.userService.getUserByEmail(this.recipientEmail).subscribe(
      (recipient: User) => {
        if (!this.currentUser) return alert('No user is connected');

        this.createTransaction(
          this.currentUser,
          -this.transactionAmount,
          TransactionType.TRANSFER,
          `Transfer to ${recipient.email}: ${this.transactionDescription}`
        ).subscribe(
          () => {
            alert('Transfer completed successfully');
          },
          (error) => {
            console.error('Recipient transaction failed:', error);
            alert('Transfer to recipient failed');
          }
        );

        this.createTransaction(
          recipient,
          this.transactionAmount,
          TransactionType.TRANSFER,
          `Transfer from ${this.currentUser?.email}: ${this.transactionDescription}`
        ).subscribe(
          () => {
            alert('Transfer completed successfully');
            this.resetForm();
          },
          (error) => {
            console.error('Sender transaction failed:', error);
            alert('Transfer from sender failed');
          }
        );
      },
      (error) => {
        console.error('Recipient not found:', error);
        alert('Recipient not found');
      }
    );
  }

  private handleWithdrawal() {
    if ((this.currentUser?.balance ?? 0) < this.transactionAmount) {
      alert('Insufficient balance for withdrawal');
      return;
    }
    if (!this.currentUser) return alert('No user is connected');

    this.createTransaction(
      this.currentUser,
      -this.transactionAmount,
      TransactionType.WITHDRAWAL,
      this.transactionDescription || 'Cash withdrawal'
    ).subscribe(
      () => {
        alert('Withdrawal completed successfully');
        this.resetForm();
      },
      (error) => {
        console.error('Withdrawal transaction failed:', error);
        alert('Withdrawal failed');
      }
    );
  }

  private resetForm() {
    this.activeSection = null;
    this.transactionAmount = 0;
    this.recipientEmail = '';
    this.transactionDescription = '';
    this.loadCurrentUser();
  }

  getTransactionIcon(type: string) {
    switch (type) {
      case TransactionType.TRANSFER:
        return 'fas fa-exchange-alt';
      case TransactionType.WITHDRAWAL:
        return 'fas fa-wallet';
      case TransactionType.DEPOSIT:
        return 'fas fa-piggy-bank';
      case TransactionType.PAYMENT:
        return 'fas fa-money-bill-wave';
      default:
        return 'fas fa-question-circle';
    }
  }

  absolute(value: number): number {
    return Math.abs(value);
  }

  private createTransaction(
    recipient: User,
    amount: number,
    transactionType: TransactionType,
    description: string
  ): Observable<any> {
    const transaction: HistoricTransactions = {
      id: null,
      type: transactionType,
      amount: amount,
      description: description,
      date: new Date(),
    };

    return this.userService.addTransaction(recipient.id, transaction);
  }
}
