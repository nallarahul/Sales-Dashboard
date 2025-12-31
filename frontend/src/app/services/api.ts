import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  private get httpOptions() {
    return { withCredentials: true };
  }

  getDashboardStats() {
    return this.http.get<any>(`${this.baseUrl}/analytics/dashboard`, this.httpOptions);
  }

  getAllUsers() {
    return this.http.get<any>(`${this.baseUrl}/auth/users`, this.httpOptions);
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${this.baseUrl}/auth/users/${id}`, this.httpOptions);
  }
}