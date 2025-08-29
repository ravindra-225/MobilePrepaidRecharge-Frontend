import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RechargeService } from '../../services/recharge.service';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-recharge',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent implements OnInit {
  plans: any[] = [];
  groupedPlans: { [key: string]: any[] } = {};
  selectedPlan: any = null;
  paymentMode: string = '';
  paymentDetails: { 
    upiId?: string; 
    accountNumber?: string; 
    ifscCode?: string; 
    cardNumber?: string; 
    expiryDate?: string; 
    cvv?: string 
  } = {};
  mobileNumber: string = '';
  email: string = '';
  error: string | null = null;
  success: string | null = null;
  isLoading: boolean = false;
  isProcessing: boolean = false;

  constructor(private rechargeService: RechargeService, private authService: AuthService) {
    const token = this.authService.getToken();
    console.log('JWT Token:', token ? token.substring(0, 20) + '...' : 'No token'); // Debug
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('Decoded JWT:', decoded); // Debug
        this.mobileNumber = decoded.sub || '';
        this.email = decoded.email || '';
      } catch (e) {
        console.error('JWT decode error:', e); // Debug
        this.error = 'Invalid session. Please validate again.';
      }
    } else {
      this.error = 'Not authenticated. Please validate mobile number.';
    }
  }

  ngOnInit() {
    if (!this.error) {
      this.loadPlans();
    }
  }

  loadPlans() {
    this.isLoading = true;
    this.error = null;
    this.rechargeService.getAllPlans().subscribe({
      next: (plans) => {
        console.log('Received plans:', plans); // Debug
        this.plans = plans;
        this.groupPlansByCategory();
        this.isLoading = false;
        if (plans.length === 0) {
          this.error = 'No plans available. Please contact support.';
        }
      },
      error: (err) => {
        console.error('Load plans error:', err.message); // Debug
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  groupPlansByCategory() {
    this.groupedPlans = this.plans.reduce((acc, plan) => {
      const category = plan.category?.toUpperCase() || 'OTHER';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(plan);
      return acc;
    }, {} as { [key: string]: any[] });
    console.log('Grouped plans:', this.groupedPlans); // Debug
  }

  selectPlan(plan: any) {
    this.selectedPlan = plan;
    this.paymentMode = '';
    this.paymentDetails = {};
    this.error = null;
    this.success = null;
    console.log('Selected plan:', plan); // Debug
  }

  submitRecharge() {
    this.error = null;
    this.success = null;
    this.isProcessing = true;

    if (!this.selectedPlan) {
      this.error = 'Please select a plan';
      this.isProcessing = false;
      return;
    }
    if (!this.paymentMode) {
      this.error = 'Please select a payment mode';
      this.isProcessing = false;
      return;
    }
    if (this.paymentMode === 'UPI' && !this.isValidUpiId()) {
      this.error = 'Invalid UPI ID format';
      this.isProcessing = false;
      return;
    }
    if (this.paymentMode === 'BANK_TRANSFER' && (!this.isValidAccountNumber() || !this.isValidIfscCode())) {
      this.error = 'Invalid account number or IFSC code';
      this.isProcessing = false;
      return;
    }
    if (this.paymentMode === 'CARD' && (!this.isValidCardNumber() || !this.isValidExpiryDate() || !this.isValidCvv())) {
      this.error = 'Invalid card details';
      this.isProcessing = false;
      return;
    }

    const rechargeData = {
      mobileNumber: this.mobileNumber,
      planId: this.selectedPlan.id,
      amount: this.selectedPlan.price,
      paymentMode: this.paymentMode,
      transactionId: 'TXN' + Math.random().toString(36).substring(2, 11),
      paymentDetails: this.paymentDetails,
      email: this.email
    };
    console.log('Recharge Data:', rechargeData); // Debug

    this.rechargeService.recharge(rechargeData).subscribe({
      next: (response) => {
        console.log('Recharge Success:', response); // Debug
        this.success = response.message;
        this.error = null; // Explicitly clear error
        this.paymentDetails = {};
        this.paymentMode = '';
        this.selectedPlan = null;
        this.isProcessing = false;
        setTimeout(() => (this.success = null), 5000);
      },
      error: (err) => {
        console.error('Recharge Failure:', err.message); // Debug
        this.error = err.message;
        this.success = null; // Clear success
        this.isProcessing = false;
      }
    });
  }

  isValidUpiId(): boolean {
    return /^[\w.-]+@[\w.-]+$/.test(this.paymentDetails.upiId || '');
  }

  isValidAccountNumber(): boolean {
    return /^\d{9,18}$/.test(this.paymentDetails.accountNumber || '');
  }

  isValidIfscCode(): boolean {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(this.paymentDetails.ifscCode || '');
  }

  isValidCardNumber(): boolean {
    return /^\d{16}$/.test(this.paymentDetails.cardNumber || '');
  }

  isValidExpiryDate(): boolean {
    const expiry = this.paymentDetails.expiryDate || '';
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/').map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    return month >= 1 && month <= 12 && year >= currentYear && (year > currentYear || month >= currentMonth);
  }

  isValidCvv(): boolean {
    return /^\d{3,4}$/.test(this.paymentDetails.cvv || '');
  }

  logout() {
    this.authService.logout();
    window.location.href = '/user-validate';
  }

  viewHistory() {
    window.location.href = '/user-history';
  }
}