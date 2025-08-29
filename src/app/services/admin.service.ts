import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getExpiringSubscribers(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Not authenticated. Please login.'));
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/admin/subscribers/expiring`, { headers }).pipe(
      catchError((err) => {
        let message = 'Failed to load subscribers';
        if (err.status === 401) {
          message = 'Session expired. Please login again.';
        } else if (err.status === 500) {
          message = 'Server error while fetching subscribers';
        }
        return throwError(() => new Error(message));
      })
    );
  }

  getRechargeHistory(mobileNumber: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Not authenticated. Please login.'));
    }
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/admin/subscribers/${mobileNumber}/rechargehistory`, { headers }).pipe(
      catchError((err) => {
        let message = 'Failed to load recharge history';
        if (err.status === 404) {
          message = `Mobile number ${mobileNumber} not found`;
        } else if (err.status === 401) {
          message = 'Session expired. Please login again.';
        } else if (err.status === 500) {
          message = 'Server error while fetching history';
        }
        return throwError(() => new Error(message));
      })
    );
  }
}