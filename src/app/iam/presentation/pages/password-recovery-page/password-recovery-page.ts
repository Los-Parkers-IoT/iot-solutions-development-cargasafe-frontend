import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-password-recovery-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './password-recovery-page.html',
  styleUrls: ['./password-recovery-page.css']
})
export class PasswordRecoveryPageComponent {
  username: string = '';

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  onSendRecovery(form: NgForm): void {
    Object.keys(form.controls).forEach(key => {
      form.controls[key].markAsTouched();
    });

    if (form.invalid) {
      this.showNotification('Please enter a valid email address');
      return;
    }

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailRegex.test(this.username)) {
      this.showNotification('Please enter a valid email address');
      return;
    }

    console.log('Password recovery request for:', this.username);
    this.showNotification(`Instructions sent to ${this.username}`);

    this.router.navigate(['/password-recovery/otp-verify']);
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

  onSignIn(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
