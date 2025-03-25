import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/core/models/GestionUser/Role';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  currentUser: User | null = null;
  Role = Role;

  badges = [
    {
      name: 'Early Adopter',
      icon: 'fas fa-rocket',
      color: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      description: 'Joined in first month',
      earned: true,
    },
    {
      name: 'Scholar',
      icon: 'fas fa-graduation-cap',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Completed 10 courses',
      earned: true,
    },
    {
      name: 'Helper',
      icon: 'fas fa-hands-helping',
      color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      description: 'Helped 5 community members',
      earned: false,
    },
  ];

  tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'events', label: 'Events' },
    { id: 'courses', label: 'Courses' },
  ];
  activeTab: string = 'posts';

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

  switchTab(tabId: string): void {
    this.activeTab = tabId;
  }

  logout(): void {
    this.authService.logout();
  }
}
