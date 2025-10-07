import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.email && this.password) {
      console.log('Login attempt:', {
        email: this.email,
        password: '***',
        rememberMe: this.rememberMe
      });

    } else {
      console.error('Please fill in all fields');
    }
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/password-recovery']);
  }

  onSignUp(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
}
