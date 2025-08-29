import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-validate',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './user-validate.component.html',
  styleUrls: ['./user-validate.component.css']
})
export class UserValidateComponent {
  mobile = { mobileNumber: '' };
  error: string | null = null;
  success: string | null = null;
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  validate() {
    this.error = null;
    this.success = null;
    this.isLoading = true;
    
    if (!this.isValidMobileNumber()) {
      this.error = 'Mobile number must be 10 digits';
      this.isLoading = false;
      return;
    }
    
    this.authService.userValidate(this.mobile).subscribe({
      next: () => {
        this.success = 'Mobile validated successfully';
        this.isLoading = false;
        setTimeout(() => {
          window.location.href = '/recharge';
        }, 2000);
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  isValidMobileNumber(): boolean {
    return /^\d{10}$/.test(this.mobile.mobileNumber);
  }
}