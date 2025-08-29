import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})
export class UserRegisterComponent {
  user = { mobileNumber: '', name: '', email: '' };
  error: string | null = null;
  success: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  register() {
    this.error = null;
    this.success = null;
    this.isLoading = true;
    
    if (!this.isValidMobileNumber()) {
      this.error = 'Mobile number must be 10 digits';
      this.isLoading = false;
      return;
    }
    if (!this.isValidEmail()) {
      this.error = 'Invalid email format';
      this.isLoading = false;
      return;
    }
    
    this.authService.userRegister(this.user).subscribe({
      next: () => {
        this.success = 'User successfully registered';
        this.isLoading = false;
        setTimeout(() => (window.location.href = '/user-validate'), 3000);
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  isValidMobileNumber(): boolean {
    return /^\d{10}$/.test(this.user.mobileNumber);
  }

  isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email);
  }
}