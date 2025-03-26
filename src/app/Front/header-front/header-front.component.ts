import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from 'src/app/core/services/Auth/auth.service';

@Component({
  selector: 'app-header-front',
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css'],
})
export class HeaderFrontComponent implements OnInit {
  currentUserEmail: string | null = null;
  isAdmin: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUserEmail =
      this.authService.getCurrentUserEmail();

    this.isAdmin = this.authService.isAdmin();
      
  }

  logout(): void {
    this.authService.logout();
  }
}
