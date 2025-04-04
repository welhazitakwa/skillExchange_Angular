import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { Observable } from 'rxjs';
import { Badge } from 'src/app/core/models/GestionUser/Badge';
import { Banned } from 'src/app/core/models/GestionUser/Banned';
import {
  HistoricTransactions,
  TransactionType,
} from 'src/app/core/models/GestionUser/HistoricTransactions';
import { Role } from 'src/app/core/models/GestionUser/Role';
import { User } from 'src/app/core/models/GestionUser/User';
import { UserStatus } from 'src/app/core/models/GestionUser/UserStatus';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { BadgeService } from 'src/app/core/services/GestionUser/badge.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-user-back-details',
  templateUrl: './user-back-details.component.html',
  styleUrls: ['./user-back-details.component.css'],
})
export class UserBackDetailsComponent {
  currentUser: User = new User();
  user: User = new User();
  banInfo: Banned = new Banned();

  showBanModal = false;
  showBadgeModal = false;
  showPromoteModal = false;
  showGiftModal = false;

  selectedBadgeId!: number;
  tokenAmount = 0.0;
  availableBadges: Badge[] = [];

  transactions: HistoricTransactions[] = [];
  UserStatus = UserStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private badgeService: BadgeService,
    private userService: UserService,
    private authService: AuthService,
    private _toastService: ToastService
  ) {}

  fetchCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    console.log(currentUserEmail);
    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user: User) => {
        this.currentUser = user;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private loadBadges(): void {
    this.badgeService.getAllBadges().subscribe(
      (response: Badge[]) => {
        this.availableBadges = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userId = params['id'];
      this.loadUserDetails(userId);
    });

    this.fetchCurrentUser();
    this.loadBadges();
  }

  private loadUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (user: User) => {
        this.user = user;

        if (user.historicTransactions)
          this.transactions = user.historicTransactions.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
      },
      (err: any) => {
        console.error('Error loading user:', err);
        this.router.navigate(['/users']);
      }
    );
  }

  banUser(): void {
    if (this.user && this.banInfo.reason && this.banInfo.endDate) {
      this.banInfo.bannedBy = this.currentUser.id;
      console.log(this.banInfo);
      this.userService.banUser(this.user.id, this.banInfo).subscribe(
        (result: any) => {
          this._toastService.success('User banned successfully!');
        },
        (err: any) => {
          this._toastService.error('Failed to ban user. Please try again.');
          console.error('Error banning user:', err);
        }
      );
      this.router.navigate(['/backusers']);
    } else {
      this._toastService.warn('Please fill all required ban information!');
    }
  }

  unbanUser(): void {
    if (this.user) {
      this.userService.unBanUser(this.user.id).subscribe(
        (result: any) => {
          this._toastService.success('User unbanned successfully!');
          this.user.ban = null;
        },
        (err: any) => {
          this._toastService.error('Failed to unban user. Please try again.');
          console.error('Error banning user:', err);
        }
      );
    }
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

  removeBadgeFromUser(badge: Badge) {
    this.userService.removeBadgeFromUser(this.user.id, badge.id).subscribe(
      (result: any) => {
        this._toastService.success('Badge removed from user successfully!');
        this.user.badges = this.user.badges.filter(
          (b: Badge) => b.id !== badge.id
        );
      },
      (err: any) => {
        this._toastService.error(
          'Failed to remove badge from user. Please try again.'
        );
        console.error('Error removing badge from user:', err);
      }
    );
  }

  assignBadge() {
    if (this.selectedBadgeId) {
      this.userService
        .assignBadgeToUser(this.user.id, this.selectedBadgeId)
        .subscribe(
          (result: any) => {
            this.router.navigate(['/backusers']);
            this._toastService.success('Badge assigned successfully!');
          },
          (err: any) => {
            this._toastService.error(
              'Failed to assign badge. Please try again.'
            );
            console.error('Error assigning badge:', err);
          }
        );
    }
  }
  promoteToAdmin() {
    console.log('Promoting user to admin');
    this.user.role = Role.ADMIN;
    this.userService.updateUser(this.user).subscribe(
      (res) => alert('User updated successfully'),
      (err) => console.error('Error updating user:', err)
    );
  }

  demoteToUser() {
    console.log('Demoting user to user');
    this.user.role = Role.USER;
    this.userService.updateUser(this.user).subscribe(
      (res) => alert('User updated successfully'),
      (err) => console.error('Error updating user:', err)
    );
  }

  giftTokens() {
    if (this.tokenAmount > 0) {
      // Call your token gifting service here
      console.log('Gifting tokens:', this.tokenAmount);
      this.user.balance += this.tokenAmount;

      this.createTransaction(
        this.user,
        this.tokenAmount,
        TransactionType.DEPOSIT,
        `Admin gift from ${this.currentUser.email}`
      ).subscribe(
        () => {
          alert(`${this.tokenAmount} tokens gifted successfully!`);
          this.tokenAmount = 0.0;
          this.loadUserDetails(this.user.id);
        },
        (err) => {
          console.error('Transaction failed:', err);
          alert('Token gift failed. Please try again.');
        }
      );
    }
  }
  closeModals(): void {
    this.showBanModal = false;
    this.showBadgeModal = false;
    this.showPromoteModal = false;
    this.showGiftModal = false;
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
