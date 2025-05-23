import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Role } from 'src/app/core/models/GestionUser/Role';
import { User } from 'src/app/core/models/GestionUser/User';
import { AuthService } from 'src/app/core/services/Auth/auth.service';
import { UserService } from 'src/app/core/services/GestionUser/user.service';
import { MailService } from 'src/app/core/services/Mailing/mail.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  currentUser: User = new User();

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

  showCropperModal = false;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  verificationCode: string = '';
  userEnteredCode: string = '';
  showVerificationModal: boolean = false;
  resendCooldown: number = 30;
  canResend: boolean = true;

  showSignatureModal = false;

  showdeleteConfirmation = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private mailService: MailService,
    private _toastService: ToastService,
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
    this._toastService.error(
      'Image load failed'
    );
    this.showCropperModal = false;
  }

  cancelCrop() {
    this.showCropperModal = false;
    this.imageChangedEvent = null;
    this.croppedImage = null;
  }

  async saveCrop() {
    if (!this.croppedImage) return;

    try {

      const containsFace = await this.detectHumanFace(this.croppedImage);

      if (!containsFace) {
        this._toastService.error(
          'Please upload an image with a clear human face'
        );
        this.showCropperModal = false;
        return;
      }

      const file = new File([this.croppedImage], 'profile-image.png', {
        type: 'image/png',
        lastModified: Date.now(),
      });

      const formData = new FormData();
      formData.append('file', file);

      this.userService.updateUserImage(this.currentUser, formData).subscribe(
        (updatedUser: User) => {
          this.currentUser = updatedUser;
          this._toastService.success(
            'Profile photo changed successfully'
          );
          this.showCropperModal = false;
        },
        (error) => {
          console.error('Error uploading image:', error);
          this._toastService.error(
            'Error uploading image'
          );
          this.showCropperModal = false;
        }
      );
    } catch (error) {
      console.error('Face detection error:', error);
      this._toastService.error(
        'Error verifying image. Please try again.'
      );
    }
  }

  private async detectHumanFace(imageBlob: Blob): Promise<boolean> {
    const endpoint = 'https://api-us.faceplusplus.com/facepp/v3/detect';
    const apiKey = 'I0GufPISdZ8KDNi-KYP6ZOKlA9CwOykW'; // Replace with your actual API key
    const apiSecret = 'vkWZGZIaQ07b43c7P_lcgNyEhhy-pQRm'; // Replace with your actual API secret
  
    const formData = new FormData();
    formData.append('api_key', apiKey);
    formData.append('api_secret', apiSecret);
    formData.append('image_file', new File([imageBlob], 'face-image.jpg', { type: 'image/jpeg' }));
    formData.append('return_attributes', 'none'); // We only need face detection
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Face++ API error:', errorData);
        throw new Error(`Face detection failed: ${errorData.error_message || 'Unknown error'}`);
      }
  
      const result = await response.json();
      return result.faces && result.faces.length > 0;
    } catch (error) {
      console.error('Face detection error:', error);
      throw error;
    }
  }

  saveProfile() {
    this.userService.updateUser(this.currentUser).subscribe(
      (response) => {
        console.log('Profile updated successfully:', response);
        this._toastService.success(
          'Profile updated successfully!'
        );
      },
      (error) => {
        console.error('Error updating profile:', error);
        this._toastService.error(
          'Failed to update profile. Please try again.'
        );
      }
    );
  }

  changePassword() {
    if (this.password.new !== this.password.confirm) {
      this._toastService.error(
        'New password and confirmation do not match'
      );
      return;
    }

    this.userService
      .changeUserPassword(this.password.current, this.password.new)
      .subscribe({
        next: () => {
          this._toastService.success(
            'Password changed successfully'
          );
          this.authService.logout();
        },
        error: (err) => {
          this._toastService.error(
            err.error.message || 'Failed to change password'
          );
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

  verifyEmail() {
    this.verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    this.showVerificationModal = true;
    this.sendVerificationCode();
  }

  private sendVerificationCode() {
    this.mailService
      .sendVerificationCode(this.currentUser.email, this.verificationCode)
      .subscribe(
        () => {
          this.startResendCooldown();
        },
        (err) => {
          console.error('Failed to send verification email:', err);
          this._toastService.error(
            'Failed to send verification code. Please try again.'
          );
        }
      );
  }

  private startResendCooldown() {
    this.canResend = false;
    const interval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(interval);
        this.canResend = true;
        this.resendCooldown = 30;
      }
    }, 1000);
  }

  handleVerification() {
    if (this.userEnteredCode === this.verificationCode) {
      this.currentUser.verified = true;
      this.userService.updateUser(this.currentUser).subscribe(
        (updatedUser: User) => {
          this.currentUser = updatedUser;
          this.showVerificationModal = false;
        },
        (err) => {
          this._toastService.error('Verification failed. Please try again.');
        }
      );
    } else {
      this._toastService.error('Invalid verification code. Please try again.');
    }
  }

  resendVerificationCode() {
    if (this.canResend) {
      this.verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      this.sendVerificationCode();
    }
  }

  handleSignatureSave(signatureData: string) {
    this.currentUser.signature = signatureData;
    this.userService.updateUser(this.currentUser).subscribe({
      next: (updatedUser) => {
        this.currentUser = updatedUser;
        this.showSignatureModal = false;
        this._toastService.success('Signature saved successfully');
      },
      error: (err) => {
        console.error('Error saving signature:', err);
        this._toastService.error('Failed to save signature');
      },
    });
  }

  confirmDeleteAccount() {
    this.userService.deleteUser(this.currentUser.id).subscribe(
      () => {
        this.authService.logout();
        this.showdeleteConfirmation = false;
      },
      (error) => {
        console.error('Error deleting user:', error);
        this._toastService.error('Failed to delete account');
      }
    );
  }
}
