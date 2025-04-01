import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { jwtDecode } from 'jwt-decode';
import { SignIn } from 'src/app/core/models/Auth/SignIn';
import { Role } from 'src/app/core/models/GestionUser/Role';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { MailService } from 'src/app/core/services/Mailing/mail.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.css'],
})
export class AuthLoginComponent {
  loginForm: FormGroup;

  showForgotPasswordModal: boolean = false;

  resetStep: 'email' | 'code' | 'password' = 'email';
  storedEmail: string = '';
  storedCode: string = '';
  forgotPasswordEmail: string = '';
  forgotPasswordSuccess: string = '';
  forgotPasswordCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
    private _toastService: ToastService,
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
        console.log(decodedToken);
        const userRole: Role = decodedToken.role;
        console.log(userRole);

        if (userRole === Role.ADMIN) {
          this.router.navigate(['/back']);
        } else this.router.navigate(['/']);
      },
      (err: any) => {
        console.log('Error signing up:', err);
        if (err.error.message === 'Account is banned') {
          this.router.navigate(['/banned/' + signIn.email]);
        } else {
          this._toastService.error(err.error.message);
        }
      }
    );

    //this.registerForm.reset();
  }

  openForgotPasswordModal() {
    this.showForgotPasswordModal = true;
    this.resetForgotPasswordState();
  }

  closeForgotPasswordModal() {
    this.showForgotPasswordModal = false;
    this.resetForgotPasswordState();
  }

  resetForgotPasswordState() {
    this.forgotPasswordEmail = '';
    this.forgotPasswordSuccess = '';
  }

  submitForgotPassword() {
    if (this.resetStep === 'email') {
      this.handleEmailStep();
    } else if (this.resetStep === 'code') {
      this.handleCodeStep();
    } else if (this.resetStep === 'password') {
      this.handlePasswordStep();
    }
  }

  private handleEmailStep() {
    if (!this.forgotPasswordEmail) {
      this._toastService.error('Please enter your email address');
      return;
    }

    this.forgotPasswordSuccess = '';

    this.userService.getBannedUserByEmail(this.forgotPasswordEmail).subscribe(
      (exists: User) => {
        if (!exists) {
          this._toastService.error('No account found with this email address');
          return;
        }
        this.storedCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        this.mailService
          .sendPasswordResetCode(this.forgotPasswordEmail, this.storedCode)
          .subscribe(
            () => {
              this.storedEmail = this.forgotPasswordEmail;
              this.resetStep = 'code';
              this._toastService.success(
                `Verification code sent to ${this.forgotPasswordEmail}`
              );
            },
            (error) => {
              this._toastService.error('Failed to send password reset code');
              this.storedEmail = this.forgotPasswordEmail;
              this.resetStep = 'code';
            }
          );
      },
      (err) => {
        this._toastService.error('No account found with this email address');
      }
    );
  }

  private handleCodeStep() {
    if (!this.forgotPasswordCode) {
      this._toastService.error('Please enter the verification code');
      return;
    }


    if (this.forgotPasswordCode == this.storedCode) {
      this.resetStep = 'password';
      this._toastService.success('Code verified! Set new password');
    } else {
      this._toastService.error('Invalid verification code');
      return;
    }
  }

  private handlePasswordStep() {
    if (this.newPassword !== this.confirmPassword) {
      this._toastService.error('Passwords do not match');
      return;
    }


    this.userService
      .resetUserPassword(this.storedEmail, this.newPassword)
      .subscribe(
        () => {
          this._toastService.success('Password updated successfully!');
          setTimeout(() => this.closeForgotPasswordModal(), 3000);
        },
        (err) => {
          this._toastService.error(
            'Error updating password. Please try again.'
          );
        }
      );
  }
  get canProceed(): boolean {
    switch (this.resetStep) {
      case 'email':
        return !!this.forgotPasswordEmail;
      case 'code':
        return (
          !!this.forgotPasswordCode && this.forgotPasswordCode.length === 6
        );
      case 'password':
        return !!this.newPassword && this.newPassword === this.confirmPassword;
      default:
        return false;
    }
  }

  getButtonText(): string {
    switch (this.resetStep) {
      case 'email':
        return 'Send Code';
      case 'code':
        return 'Verify Code';
      case 'password':
        return 'Update Password';
      default:
        return 'Continue';
    }
  }
}
