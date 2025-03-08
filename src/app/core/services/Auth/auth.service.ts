import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignUp } from '../../models/Auth/SignUp';
import { SignIn } from '../../models/Auth/SignIn';
import { catchError, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'http://localhost:8084/skillExchange/auth';
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  signup(signUpData: SignUp): Observable<any> {
    return this.http.post<SignUp>(this.url + '/signup', signUpData);
  }

  signin(userEmailPass: SignIn): Observable<any> {
    return this.http.post(this.url + '/signin', userEmailPass);
  }

  refresh(token: string): Observable<any> {
    return this.http.post(this.url + '/refresh', token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  
  getCurrentUserEmail(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getCurrentUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken)
      return decodedToken.role || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  

  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getCurrentUserRole() === 'USER';
  }
}
