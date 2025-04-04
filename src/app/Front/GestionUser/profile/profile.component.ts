import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Badge } from 'src/app/core/models/GestionUser/Badge';
import { Role } from 'src/app/core/models/GestionUser/Role';
import { User } from 'src/app/core/models/GestionUser/User';
import { UserStatus } from 'src/app/core/models/GestionUser/UserStatus';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { BadgeService } from 'src/app/core/services/GestionUser/badge.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  currentUser: User | null = null;
  Role = Role;
  friends: any = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      image: null,
      isOnline: true,
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      image: 'data:image/*;base64,...',
      isOnline: false,
    },
  ];
  isLoadingBadges: boolean = true;
  badges = [
    {
      name: '',
      icon: '',
      description: '',
      earned: true,
    },
  ];
  currentPage: number = 1;
  itemsPerPage: number = 4;
  UserStatus= UserStatus;

  get paginatedBadges(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.badges.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.badges.length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'events', label: 'Events' },
    { id: 'courses', label: 'Courses' },
  ];
  activeTab: string = 'posts';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private badgeService: BadgeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.LoadCurrentUser();
  }

  private LoadBadges() {
    this.isLoadingBadges = true;
    this.badgeService.getAllBadges().subscribe(
      (badges) => {
        this.badges = badges.map((badge: Badge) => ({
          name: badge.title,
          icon: badge.image,
          description: badge.description,
          earned: this.currentUser?.badges.find((userBadge: Badge) => {
            return userBadge.id == badge.id;
          }),
        }));
        this.isLoadingBadges = false;
      },
      (error) => {
        console.error(error);
        this.isLoadingBadges = true;
      }
    );
  }

  private LoadCurrentUser() {
    const currentUserEmail = this.authService.getCurrentUserEmail();
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }
    console.log(currentUserEmail);
    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user) => {
        console.log(user)
        this.currentUser = user;
        this.LoadBadges();
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
