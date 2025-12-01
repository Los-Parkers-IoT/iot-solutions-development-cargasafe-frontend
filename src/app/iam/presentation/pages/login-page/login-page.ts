import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Authentication} from '../../../infrastructure/authentication';
import { MatIconModule} from '@angular/material/icon';

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
    MatSnackBarModule,
    MatIconModule,
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
})
export class LoginPageComponent {
  private auth = inject(Authentication);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  email = '';
  password = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;


  isFormValid(): boolean {
    return !!this.email && !!this.password;
  }


  onSubmit(): void {
    if (!this.isFormValid() || this.isLoading) return;

    this.isLoading = true;
    console.log('[Login] submit', { email: this.email });

    this.auth
      .signIn({ email: this.email, password: this.password })
      .subscribe({
        next: (tokens) => {
          this.auth.saveTokens(tokens);
          this.snackBar.open('Login successful!', undefined, {
            duration: 1500,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.snackBar.open('Invalid credentials', undefined, {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        },
      })
      .add(() => (this.isLoading = false));
  }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
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

