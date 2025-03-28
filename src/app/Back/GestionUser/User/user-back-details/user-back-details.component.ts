import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/GestionUser/User';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-user-back-details',
  templateUrl: './user-back-details.component.html',
  styleUrls: ['./user-back-details.component.css'],
})
export class UserBackDetailsComponent {
  user: User | null = null;
  activityLogs: any[] = [];
  permissions: any[] = [];
  devices: any[] = [];

  
  transactions: any[] = [
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userId = params['id'];
      this.loadUserDetails(userId);
      this.loadMockData();
    });
  }

  private loadUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (user: User) => (this.user = user),
      (err: any) => {
        console.error('Error loading user:', err);
        this.router.navigate(['/users']);
      },
    );
  }

  private loadMockData(): void {
    // Example mock data - replace with actual API calls
    this.activityLogs = [
      {
        icon: 'sign-in-alt',
        color: 'success',
        description: 'User logged in',
        timestamp: new Date(),
      },
      {
        icon: 'lock',
        color: 'danger',
        description: 'Failed login attempt',
        timestamp: new Date(Date.now() - 3600000),
      },
    ];

    this.permissions = [
      { name: 'Create Content', allowed: true },
      { name: 'Moderate Comments', allowed: false },
      { name: 'Access Analytics', allowed: true },
    ];

    this.devices = [
      {
        type: 'Desktop',
        os: 'Windows 10',
        browser: 'Chrome 98',
        ip: '192.168.1.1',
        lastActive: new Date(),
      },
    ];
  }

  banUser(): void {
    if (this.user) {
      // this.userService.banUser(this.user.id).subscribe({
      //   next: () => (this.user!.banned = true),
      //   error: (err) => console.error('Ban failed:', err),
      // });
    }
  }

  unbanUser(): void {
    if (this.user) {
      // this.userService.unbanUser(this.user.id).subscribe({
      //   next: () => (this.user!.banned = false),
      //   error: (err) => console.error('Unban failed:', err),
      // });
    }
  }

  
  getTransactionIcon(type: string) {
    switch(type) {
      case 'transfer': return 'fas fa-exchange-alt';
      case 'withdraw': return 'fas fa-wallet';
      case 'deposit': return 'fas fa-piggy-bank';
      default: return 'fas fa-question-circle';
    }
  }
}
