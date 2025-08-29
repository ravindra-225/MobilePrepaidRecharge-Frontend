import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  login = { username: '', password: '' };
  error: string | null = null;
  success: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  loginAdmin() {
    this.error = null;
    this.success = null;
    if (!this.login.username || !this.login.password) {
      this.error = 'Username and password are required';
      return;
    }
    this.authService.adminLogin(this.login).subscribe({
      next: () => {
        this.success = 'Login successful';
        setTimeout(() => {
          window.location.href = '/admin-dashboard';
        }, 2000);
      },
      error: (err) => this.error = err.message
    });
  }
}