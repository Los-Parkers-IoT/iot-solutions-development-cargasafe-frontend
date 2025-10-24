import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './new-password-page.html',
  styleUrls: ['./new-password-page.css']
})
export class NewPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  onResetPassword(): void {
    if (!this.newPassword || !this.confirmPassword) {
      this.showNotification('Please fill in both password fields');
      return;
    }


    if (this.newPassword.length < 6) {
      this.showNotification('Password must be at least 6 characters long');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showNotification('Passwords do not match. Please verify');
      return;
    }


    console.log('Password ready to be reset.');

    this.showNotification('Password successfully reset! Redirecting to login...');

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onBackToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
