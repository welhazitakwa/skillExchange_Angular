import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignUp } from 'src/app/core/models/Auth/SignUp';
import { AuthService } from 'src/app/core/services/Auth/auth.service';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.css'],
})
export class AuthRegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Convenience getters for easy access to form controls
  get name() {
    return this.registerForm.get('name');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    let signUp: SignUp = { ...this.registerForm.value };
    signUp.role = 'USER';
    console.log(signUp);

    this.authService.signup(signUp).subscribe(
      () => {
        console.log('User signed up successfully');
        this.router.navigate(['/login']);
      },
      (error: any) => console.log('Error signing up:', error)
    );

    //this.registerForm.reset();
  }
}
