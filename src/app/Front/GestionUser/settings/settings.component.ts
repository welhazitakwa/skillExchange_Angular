import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';
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
    banned: false,
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

  showCropperModal = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';

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
    this.imageChangedEvent = event;
    this.showCropperModal = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  loadImageFailed() {
    alert('Image load failed');
    this.showCropperModal = false;
  }

  cancelCrop() {
    this.showCropperModal = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
  }

  async saveCrop() {
    if (!this.croppedImage) return;

    // Convert blob to File
    const file = new File([this.croppedImage], 'profile-image.png', {
      type: 'image/png',
      lastModified: Date.now(),
    });

    const formData = new FormData();
    formData.append('file', file);

    this.userService.updateUserImage(this.currentUser, formData).subscribe(
      (updatedUser: User) => {
        this.currentUser = updatedUser;
        this.showCropperModal = false;
      },
      (error) => {
        console.error('Error uploading image:', error);
        this.showCropperModal = false;
      }
    );
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
    if (this.password.new !== this.password.confirm) {
      alert('New password and confirmation do not match');
      return;
    }

    this.userService
      .changeUserPassword(this.password.current, this.password.new)
      .subscribe({
        next: () => {
          alert('Password changed successfully');
          this.authService.logout();
        },
        error: (err) => {
          alert(err.error.message || 'Failed to change password');
        },
      });
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
