import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RechargeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllPlans(): Observable<any[]> {
    const token = this.authService.getToken();
    console.log('getAllPlans Token:', token ? token.substring(0, 20) + '...' : 'No token'); // Debug
    if (!token) {
      return throwError(() => new Error('Not authenticated. Please validate mobile number.'));
    }
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log('getAllPlans Request Headers:', headers); // Debug
    return this.http.get(`${this.apiUrl}/plans`, { headers }).pipe(
      map((response: any) => {
        console.log('getAllPlans Raw Response:', response); // Debug
        const plans = Object.keys(response).reduce((acc, category) => {
          return acc.concat(response[category].map((plan: any) => ({
            ...plan,
            category
          })));
        }, [] as any[]);
        console.log('getAllPlans Processed Plans:', plans); // Debug
        return plans;
      }),
      catchError((err) => {
        console.error('getAllPlans Error:', err.status, err.message, err.error); // Debug
        let message = 'Failed to load plans';
        if (err.status === 401) {
          message = 'Session expired. Please validate again.';
        } else if (err.status === 403) {
          message = 'Access denied. Please login again.';
        } else if (err.status === 404) {
          message = 'Plans endpoint not found.';
        } else if (err.status === 500) {
          message = 'Server error while fetching plans';
        }
        return throwError(() => new Error(message));
      })
    );
  }

  recharge(data: any): Observable<any> {
    const token = this.authService.getToken();
    console.log('recharge Token:', token ? token.substring(0, 20) + '...' : 'No token'); // Debug
    if (!token) {
      return throwError(() => new Error('Not authenticated. Please validate mobile number.'));
    }
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'text/plain, application/json' // Accept both text and JSON
    });
    console.log('recharge Request Data:', data); // Debug
    return this.http.post(`${this.apiUrl}/customers/recharges`, data, { headers, responseType: 'text' }).pipe(
      map((response: string) => {
        console.log('recharge Response:', response); // Debug
        // Parse plain text response
        const message = response.includes('Recharge successful') ? 'Recharge successful' : 'Recharge failed';
        return { message };
      }),
      catchError((err) => {
        console.error('recharge Error:', err.status, err.message, err.error); // Debug
        let message = 'Recharge failed';
        if (err.status === 400) {
          message = err.error?.message || 'Invalid recharge details';
        } else if (err.status === 401) {
          message = 'Session expired. Please validate again.';
        } else if (err.status === 404) {
          message = 'Plan or mobile number not found';
        } else if (err.status === 500) {
          message = 'Server error during recharge';
        }
        return throwError(() => new Error(message));
      })
    );
  }

  getUserHistory(mobileNumber: string): Observable<any[]> {
    const token = this.authService.getToken();
    console.log('getUserHistory Token:', token ? token.substring(0, 20) + '...' : 'No token'); // Debug
    if (!token) {
      return throwError(() => new Error('Not authenticated. Please validate mobile number.'));
    }
    const headers = new HttpHeaders({ 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log('getUserHistory Request for mobile:', mobileNumber); // Debug
    return this.http.get(`${this.apiUrl}/customers/${mobileNumber}/rechargehistory`, { headers }).pipe(
      map((response: any) => {
        console.log('getUserHistory Raw Response:', response); // Debug
        // Handle both array and object responses
        const history = Array.isArray(response) ? response : (response.recharges || []);
        console.log('getUserHistory Processed History:', history); // Debug
        return history;
      }),
      catchError((err) => {
        console.error('getUserHistory Error:', err.status, err.message, err.error); // Debug
        let message = 'Failed to load recharge history';
        if (err.status === 401) {
          message = 'Session expired. Please validate again.';
        } else if (err.status === 403) {
          message = 'Access denied. Please login again.';
        } else if (err.status === 404) {
          message = 'No recharge history found';
        } else if (err.status === 500) {
          message = 'Server error while fetching history';
        }
        return throwError(() => new Error(message));
      })
    );
  }
}