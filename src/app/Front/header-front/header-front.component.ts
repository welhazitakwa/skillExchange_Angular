import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-header-front',
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css'],
})
export class HeaderFrontComponent implements OnInit {
  currentUser: User | null = null;

  isAdmin: boolean = false;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let currentUserEmail: string | null = this.authService.getCurrentUserEmail();
    
    if (!currentUserEmail) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserByEmail(currentUserEmail).subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => {
        console.error(error);
      }
    );

    this.isAdmin = this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
  }
}
