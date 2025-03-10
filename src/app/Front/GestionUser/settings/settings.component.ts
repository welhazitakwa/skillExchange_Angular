import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  activeTab: string = 'profile';
  twoFactorEnabled: boolean = false;

  user = {
    avatar: 'assets/default-avatar.jpg',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    bio: 'Digital enthusiast passionate about web development and user experience design.'
  };

  password = {
    current: '',
    new: '',
    confirm: ''
  };

  notifications = {
    email: true,
    push: false,
    sms: true
  };

  socialLinks = {
    twitter: '',
    facebook: ''
  };

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    // Implement profile save logic
    console.log('Profile saved:', this.user);
  }

  changePassword() {
    // Implement password change logic
    console.log('Password changed:', this.password);
    this.password = { current: '', new: '', confirm: '' };
  }

  toggleTwoFactor() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    console.log('Two-factor authentication:', this.twoFactorEnabled ? 'Enabled' : 'Disabled');
  }

  saveSocialLinks() {
    // Implement social links save logic
    console.log('Social links saved:', this.socialLinks);
  }
}