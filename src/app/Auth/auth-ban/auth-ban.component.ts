import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/GestionUser/User';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-auth-ban',
  templateUrl: './auth-ban.component.html',
  styleUrls: ['./auth-ban.component.css'],
})
export class AuthBanComponent {
  user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  banInfo = {
    id: 123,
    reason: 'Violation of community guidelines',
    endDate: new Date('2024-12-31'),
    bannedBy: 456,
  };

  get isPermanentBan(): boolean {
    return !this.banInfo.endDate;
  }

  get timeRemaining(): string {
    if (this.isPermanentBan) return 'Permanent Ban';
    const now = new Date();
    const diff = this.banInfo.endDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days remaining`;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userEmail = params['email'];
      this.loadUserDetails(userEmail);
    });
  }

  private loadUserDetails(userEmail: string): void {
    this.userService.getBannedUserByEmail(userEmail).subscribe(
      (user: User) => {
        if (user.ban) this.user = user;
        else this.router.navigate(['/login']);
      },
      (err: any) => {
        console.error('Error loading user:', err);
        this.router.navigate(['/login']);
      }
    );
  }
}
