import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  
  // Track login state by checking if a token exists
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) { }

  // --- LOGIN ---
  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        // We expect { token: "..." } from the server now
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          this.loggedIn.next(true);
        }
      })
    );
  }

  // --- LOGOUT ---
  logout() {
    // Notify backend (optional)
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => console.log('Backend notified'),
      error: (err) => console.warn('Logout warning', err),
      complete: () => {
        localStorage.clear(); // Remove token
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  // --- HELPER METHODS ---
  
  // 1. Used by Auth Guard
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // 2. Used by ApiService (THIS WAS MISSING!)
  getToken() {
    return localStorage.getItem('token');
  }

  // 3. Used by UI
  getUserRole() {
    return localStorage.getItem('role');
  }
}