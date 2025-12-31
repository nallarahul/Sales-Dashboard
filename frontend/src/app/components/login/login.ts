import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  credentials = { email: '', password: '' };
  errorMessage = '';
  
  // --- FIX: Add this missing variable ---
  loading = false; 

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    // 1. Start loading state (disables button)
    this.loading = true; 
    this.errorMessage = '';

    this.auth.login(this.credentials).subscribe({
      next: () => {
        // Login successful - Router will redirect to dashboard
        // We don't set loading = false here because we want it to stay disabled while navigating
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        // 2. Stop loading state on error so user can try again
        this.loading = false; 
        console.error('Login Failed', err);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}