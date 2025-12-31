import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth'; // Import Auth Service to get token

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient, private auth: AuthService) { }

  // Helper to create headers with the token
  private getHeaders() {
    const token = this.auth.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
    };
  }

  getDashboardStats() {
    return this.http.get<any>(`${this.baseUrl}/analytics/dashboard`, this.getHeaders());
  }

  getAllUsers() {
    return this.http.get<any>(`${this.baseUrl}/auth/users`, this.getHeaders());
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${this.baseUrl}/auth/users/${id}`, this.getHeaders());
  }
}