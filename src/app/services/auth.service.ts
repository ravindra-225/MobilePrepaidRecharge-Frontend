import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  userRegister(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, data, { responseType: 'text' }).pipe(
      map((response: string) => {
        console.log('userRegister Response:', response); // Debug
        // Handle plain text response
        const message = response.includes('registered') ? 'User successfully registered' : 'Registration failed';
        return { message };
      }),
      catchError((err) => {
        console.error('userRegister Error:', err.status, err.message, err.error); // Debug
        let message = 'Registration failed';
        if (err.status === 400 && err.error?.message?.includes('already exists')) {
          message = 'Mobile number already registered';
        } else if (err.status === 400) {
          message = 'Invalid input data. Check mobile number or email format.';
        } else if (err.status === 500) {
          message = 'Server error during registration';
        }
        return throwError(() => new Error(message));
      })
    );
  }

  userValidate(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/validate`, data).pipe(
      map((response: any) => {
        if (response.token) {
          this.saveToken(response.token, 'ROLE_USER');
        }
        return { message: 'Mobile validated successfully' };
      }),
      catchError((err) => {
        let message = 'Validation failed';
        if (err.status === 404) {
          message = 'Mobile number not found';
        } else if (err.status === 400) {
          message = 'Invalid mobile number format';
        } else if (err.status === 500) {
          message = 'Server error during validation';
        }
        return throwError(() => new Error(message));
      })
    );
  }

  adminRegister(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/register`, data, { responseType: 'text' as 'json' }).pipe(
      map((response: any) => {
        console.log('Backend response:', response); // Debug log
        let message = 'Admin successfully registered';
        if (typeof response === 'string') {
          message = response;
        } else if (response?.message) {
          message = response.message;
        }
        return { message };
      }),
      catchError((err) => {
        console.error('Admin register error:', err);
        let message = 'Admin registration failed';
        if (err.status === 400) {
          if (err.error?.message?.includes('username')) {
            message = 'Username already exists';
          } else if (err.error?.message?.includes('email')) {
            message = 'Email already registered';
          } else {
            message = 'Invalid input data. Check username, email, or password format.';
          }
        } else if (err.status === 500) {
          message = 'Server error during admin registration';
        } else if (err.status === 0) {
          message = 'Network error. Please check your connection.';
        }
        return throwError(() => new Error(message));
      })
    );
  }

  adminLogin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      map((response: any) => {
        if (response.token) {
          this.saveToken(response.token, 'ROLE_ADMIN');
        }
        return { message: 'Login successful' };
      }),
      catchError((err) => {
        let message = 'Login failed';
        if (err.status === 401) {
          message = 'Invalid username or password';
        } else if (err.status === 500) {
          message = 'Server error during login';
        }
        return throwError(() => new Error(message));
      })
    );
  }

  saveToken(token: string, role: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
}