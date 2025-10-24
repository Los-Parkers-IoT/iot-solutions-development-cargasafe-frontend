import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPageComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  onSubmit(): void {
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

    if (!this.email || !this.password) {
      this.showNotification('Please fill in all fields');
      return;
    }

    if (!emailRegex.test(this.email)) {
      this.showNotification('Please enter a valid email address');
      return;
    }

    if (this.password.length < 6) {
      this.showNotification('Password must be at least 6 characters');
      return;
    }

    console.log('Login attempt:', {
      email: this.email,
      password: '***',
      rememberMe: this.rememberMe
    });

    // TODO: Aquí conectarás con tu backend
    this.router.navigate(['/dashboard']);
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
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
