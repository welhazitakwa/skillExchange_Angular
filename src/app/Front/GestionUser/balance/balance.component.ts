import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css']
})
export class BalanceComponent {
  currentUser: User | null = null;
  activeSection: string | null = null;
  transactionAmount: number = 0;
  recipientEmail: string = '';
  transactionDescription: string = '';


  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  
  ngOnInit(): void {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    console.log(currentUserEmail);
    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  transactions = [
    { 
      type: 'transfer',
      description: 'Sent to John Doe',
      date: new Date('2024-03-15'),
      amount: -500.00
    },
    {
      type: 'deposit',
      description: 'Salary Deposit',
      date: new Date('2024-03-10'),
      amount: 4500.00
    },
    {
      type: 'withdraw',
      description: 'ATM Withdrawal',
      date: new Date('2024-03-05'),
      amount: -300.00
    }
  ];

  showSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }

  submitTransaction() {
    // Add transaction logic here
    console.log('Transaction submitted:', {
      type: this.activeSection,
      amount: this.transactionAmount,
      recipient: this.recipientEmail,
      description: this.transactionDescription
    });

    // Reset form
    this.activeSection = null;
    this.transactionAmount = 0;
    this.recipientEmail = '';
    this.transactionDescription = '';
  }

  getTransactionIcon(type: string) {
    switch(type) {
      case 'transfer': return 'fas fa-exchange-alt';
      case 'withdraw': return 'fas fa-wallet';
      case 'deposit': return 'fas fa-piggy-bank';
      default: return 'fas fa-question-circle';
    }
  }

  // Add to your component class
  absolute(value: number): number {
    return Math.abs(value);
  }
}