import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // 1. Existing Dashboard call
  getDashboardStats(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<any>(`${this.baseUrl}/analytics/dashboard`, { headers });
  }

  // 2. NEW: Get All Users
  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<any>(`${this.baseUrl}/auth/users`, { headers });
  }

  // 3. NEW: Delete a User
  deleteUser(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.delete<any>(`${this.baseUrl}/auth/users/${userId}`, { headers });
  }
}