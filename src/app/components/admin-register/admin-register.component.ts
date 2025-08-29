import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent {
  admin = { username: '', email: '', password: '', name: '' };
  error: string | null = null;
  success: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  register() {
    this.error = null;
    this.success = null;
    this.isLoading = true;

    // Client-side validation
    if (!this.isValidUsername()) {
      this.error = 'Username must be at least 4 characters';
      this.isLoading = false;
      return;
    }
    if (!this.isValidEmail()) {
      this.error = 'Invalid email format';
      this.isLoading = false;
      return;
    }
    if (!this.isValidPassword()) {
      this.error = 'Password must be at least 8 characters, include uppercase, lowercase, digit, and special character';
      this.isLoading = false;
      return;
    }
    if (!this.isValidName()) {
      this.error = 'Name is required';
      this.isLoading = false;
      return;
    }

    // Call the auth service to register admin
    this.authService.adminRegister(this.admin).subscribe({
      next: (response) => {
        console.log('Registration success:', response); // Debug log
        this.success = response.message;
        this.isLoading = false;
        setTimeout(() => (window.location.href = '/admin-login'), 3000);
      },
      error: (err) => {
        console.error('Registration failed:', err); // Debug log
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  isValidUsername(): boolean {
    return this.admin.username.length >= 4;
  }

  isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.admin.email);
  }

  isValidPassword(): boolean {
    const password = this.admin.password;
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password)
    );
  }

  isValidName(): boolean {
    return this.admin.name.trim().length > 0;
  }
}