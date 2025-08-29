import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RechargeService } from '../../services/recharge.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-history.component.html',
  styleUrls: ['./user-history.component.css']
})
export class UserHistoryComponent implements OnInit {
  rechargeHistory: any[] = [];
  mobileNumber: string = '';
  email: string = '';
  error: string | null = null;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private rechargeService: RechargeService
  ) {
    const token = this.authService.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.mobileNumber = decoded.sub || '';
        this.email = decoded.email || '';
      } catch (e) {
        this.error = 'Invalid session. Please validate again.';
      }
    } else {
      this.error = 'Not authenticated. Please validate mobile number.';
    }
  }

  ngOnInit() {
    if (!this.error) {
      this.loadRechargeHistory();
    }
  }

  loadRechargeHistory() {
    this.isLoading = true;
    this.error = null;
    
    this.rechargeService.getUserHistory(this.mobileNumber).subscribe({
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

  goBack() {
    window.location.href = '/recharge';
  }

  logout() {
    this.authService.logout();
    window.location.href = '/user-validate';
  }
} 