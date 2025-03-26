import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from 'src/app/core/models/GestionUser/Role';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  currentUser: User = {
    name: '',
    email: '',
    id: 0,
    role: Role.USER,
    verified: false,
    image: '',
    balance: 0,
    signature: '',
    banned: false
  };
  
  activeTab: string = 'profile';
  twoFactorEnabled: boolean = false;

  password = {
    current: '',
    new: '',
    confirm: '',
  };

  notifications = {
    email: true,
    push: false,
    sms: true,
  };

  socialLinks = {
    twitter: '',
    facebook: '',
  };

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.user.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    this.userService.updateUser(this.currentUser).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
        alert('Profile updated successfully!');
      },
      (error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      }
    );
  }

  changePassword() {
    // Implement password change logic
    console.log('Password changed:', this.password);
    this.password = { current: '', new: '', confirm: '' };
  }

  toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    console.log(
      'Two-factor authentication:',
      this.twoFactorEnabled ? 'Enabled' : 'Disabled'
    );
  }

  saveSocialLinks() {
    // Implement social links save logic
    console.log('Social links saved:', this.socialLinks);
  }
}
