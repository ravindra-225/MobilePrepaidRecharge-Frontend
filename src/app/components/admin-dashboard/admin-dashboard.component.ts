import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Added
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule], // Added CommonModule
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  subscribers: any[] = [];
  history: any[] = [];
  mobileNumber: string = '';
  error: string | null = null;
  success: string | null = null;
  rechargeHistory: any[] = [];
  isLoading: boolean = false;

  constructor(private adminService: AdminService, private authService: AuthService) {}

  ngOnInit() {
    this.loadSubscribers();
  }

  loadSubscribers() {
    this.error = null;
    this.success = null;
    this.adminService.getExpiringSubscribers().subscribe({
      next: (data) => {
        this.subscribers = data;
        this.success = 'Subscribers loaded successfully';
        setTimeout(() => {
          this.success = null;
        }, 3000);
      },
      error: (err) => (this.error = err.message)
    });
  }

  loadHistory() {
    this.error = null;
    this.success = null;
    if (!this.isValidMobileNumber()) {
      this.error = 'Mobile number must be 10 digits';
      return;
    }
    this.adminService.getRechargeHistory(this.mobileNumber).subscribe({
      next: (data) => {
        this.history = data;
        this.success = `Recharge history for ${this.mobileNumber} loaded successfully`;
        setTimeout(() => {
          this.success = null;
        }, 3000);
      },
      error: (err) => (this.error = err.message)
    });
  }

  isValidMobileNumber(): boolean {
    return /^\d{10}$/.test(this.mobileNumber);
  }

  logout() {
    this.authService.logout();
    window.location.href = '/admin-login';
  }

  getRechargeHistory() {
    this.error = null;
    this.isLoading = true;
    this.rechargeHistory = [];
    if (!/^\d{10}$/.test(this.mobileNumber)) {
      this.error = 'Please enter a valid 10-digit mobile number.';
      this.isLoading = false;
      return;
    }
    this.adminService.getRechargeHistory(this.mobileNumber).subscribe({
      next: (history) => {
        this.rechargeHistory = history;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load recharge history';
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-unknown';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}