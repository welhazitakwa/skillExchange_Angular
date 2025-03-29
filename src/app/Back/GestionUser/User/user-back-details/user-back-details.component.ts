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

  showBanModal = false;
  showBadgeModal = false;
  showPromoteModal = false;
  showGiftModal = false;

  banReason = '';
  banEndDate: Date | null = null;
  selectedBadge = '';
  tokenAmount = 0.00;
  availableBadges = [
    // Example data - replace with your actual badges
    { id: 'gold', name: 'Gold Badge' },
    { id: 'silver', name: 'Silver Badge' },
    { id: 'bronze', name: 'Bronze Badge' },
  ];

  transactions: any[] = [
    {
      type: 'transfer',
      description: 'Sent to John Doe',
      date: new Date('2024-03-15'),
      amount: -500.0,
    },
    {
      type: 'deposit',
      description: 'Salary Deposit',
      date: new Date('2024-03-10'),
      amount: 4500.0,
    },
    {
      type: 'withdraw',
      description: 'ATM Withdrawal',
      date: new Date('2024-03-05'),
      amount: -300.0,
    },
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
      }
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
    switch (type) {
      case 'transfer':
        return 'fas fa-exchange-alt';
      case 'withdraw':
        return 'fas fa-wallet';
      case 'deposit':
        return 'fas fa-piggy-bank';
      default:
        return 'fas fa-question-circle';
    }
  }


  assignBadge() {
    if (this.selectedBadge) {
      // Call your badge assignment service here
      console.log('Assigning badge:', this.selectedBadge);
    }
  }
  promoteToAdmin() {
    // Call your admin promotion service here
    console.log('Promoting user to admin');
  }

  giftTokens() {
    if (this.tokenAmount > 0) {
      // Call your token gifting service here
      console.log('Gifting tokens:', this.tokenAmount);
    }
  }
}
