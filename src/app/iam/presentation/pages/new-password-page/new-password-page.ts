import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

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

  constructor(private router: Router) {}

  onResetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      // Translated alert
      alert('Passwords do not match. Please verify.');
      return;
    }

    if (this.newPassword.length < 8) {
      alert('The password must be at least 8 characters long.');
      return;
    }

    console.log('Password ready to be reset.');

    alert('Password successfully reset! You will be redirected to the login page.');
    this.router.navigate(['/login']);
  }

  onBackToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
