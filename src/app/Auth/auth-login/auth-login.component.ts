import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { SignIn } from 'src/app/core/models/Auth/SignIn';
import { Role } from 'src/app/core/models/GestionUser/Role';
import { AuthService } from 'src/app/core/services/Auth/auth.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
})
export class AuthLoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    let signIn: SignIn = { ...this.loginForm.value };

    this.authService.signin(signIn).subscribe(
      (response: any) => {
        console.log(response.token);
        localStorage.setItem('token', response.token);

        const decodedToken: any = jwtDecode(response.token);
        console.log(decodedToken)
        const userRole: Role = decodedToken.role;
        console.log(userRole)
        if (userRole === Role.ADMIN) {
          this.router.navigate(['/back']);
        } else this.router.navigate(['/']);
      },
      (error: any) => console.log('Error signing up:', error)
    );

    //this.registerForm.reset();
  }
}
