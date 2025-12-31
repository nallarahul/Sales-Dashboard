import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule], // Needed for *ngFor in the HTML
  templateUrl: './users.html',
  styles: [`
    .table-hover tbody tr:hover { background-color: #f8f9fa; }
  `]
})
export class Users implements OnInit {
  users: any[] = [];
  errorMessage: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.api.getAllUsers().subscribe({
      next: (data) => {
        console.log('API Response (Users):', data); // <--- Check your Browser Console for this!

        // CASE 1: The backend returned a plain array [ user1, user2 ]
        if (Array.isArray(data)) {
          this.users = data;
        } 
        // CASE 2: The backend returned an object { users: [...] } or { data: [...] }
        else if (data.users) {
          this.users = data.users;
        } 
        else if (data.data) {
          this.users = data.data;
        }
        else {
          console.warn('Could not find a user array in the response');
          this.users = [];
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Could not load users. Are you an Admin?';
      }
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.api.deleteUser(id).subscribe({
        next: () => {
          // Remove user from the list instantly without refreshing
          this.users = this.users.filter(u => u._id !== id);
          alert('User deleted!');
        },
        error: (err) => alert('Failed to delete user')
      });
    }
  }
}