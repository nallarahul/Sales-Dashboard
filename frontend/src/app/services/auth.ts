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
  
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) { }

  private hasToken(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(res => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', res.role);
        this.loggedIn.next(true);
      })
    );
  }

  register(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, userData, { withCredentials: true }).pipe(
      tap(res => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', res.role);
        this.loggedIn.next(true);
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      this.loggedIn.next(false);
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getUserRole() {
    return localStorage.getItem('role');
  }
}