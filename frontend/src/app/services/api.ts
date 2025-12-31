import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Ensure this matches your backend port
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Fetch Dashboard Data (Protected Route)
  getDashboardStats(): Observable<any> {
    // 1. Get the token we saved during login
    const token = localStorage.getItem('token');
    
    // 2. Create the header with "Bearer <token>"
    // This is what your backend 'protect' middleware looks for
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // 3. Send the GET request with the headers
    return this.http.get<any>(`${this.baseUrl}/analytics/dashboard`, { headers });
  }
}