import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SignUp } from '../../models/Auth/SignUp';
import { SignIn } from '../../models/Auth/SignIn';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'http://localhost:8084/skillExchange/auth';
  constructor(private http: HttpClient) {}

  signup(signUpData: SignUp): Observable<any> {
    return this.http.post<SignUp>(
      this.url+'/signup',
      signUpData
    );
  }

  signin(userEmailPass: SignIn) {
    return this.http.post(this.url + '/signin', userEmailPass);
  }

  refresh(token: string) {
    return this.http.post(this.url + '/refresh', token);
  }
}
