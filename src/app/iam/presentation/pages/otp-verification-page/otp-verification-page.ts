import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './otp-verification-page.html',
  styleUrls: ['./otp-verification-page.css']
})
export class OtpVerificationComponent {
  otpCode: string[] = ['', '', '', '', '', ''];

  constructor(private router: Router, private snackBar: MatSnackBar) {
  }

  showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  onVerifyCode(): void {
    // ✅ CORRECCIÓN CLAVE DE NAVEGACIÓN: Retrasamos la verificación para que Angular actualice el modelo.
    setTimeout(() => {
      const code = this.otpCode.join('');

      if (code.length === 6) {
        console.log('OTP Code submitted (Navigating to New Password):', code);
        this.router.navigate(['/password-recovery/new-password']);
      } else {
        // En tu imagen se ve que el código está incompleto o desordenado.
        this.showNotification('Por favor, ingrese el código de 6 dígitos completo.');
      }
    }, 50); // 50ms son suficientes para un ciclo de detección de cambios.
  }

  onResendCode(event: Event): void {
    event.preventDefault();
    this.showNotification('A new code has been sent to your e-mail.');
  }

  onBackToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;


    if (event.key === 'Backspace') {
      event.preventDefault();
      this.otpCode[index] = '';
      if (index > 0) {
        setTimeout(() => {
          const prevInput = document.querySelector(`#otp-${index - 1}`) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
            prevInput.select();
          }
        }, 0);
      }
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      this.otpCode[index] = '';
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      setTimeout(() => {
        const prevInput = document.querySelector(`#otp-${index - 1}`) as HTMLInputElement;
        if (prevInput) prevInput.focus();
      }, 0);
      return;
    }

    if (event.key === 'ArrowRight' && index < this.otpCode.length - 1) {
      setTimeout(() => {
        const nextInput = document.querySelector(`#otp-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }, 0);
      return;
    }

    // Solo permitir números
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
      return;
    }

    // Si ya hay un valor, reemplazarlo
    event.preventDefault();
    this.otpCode[index] = event.key;

    // Mover al siguiente input
    if (index < this.otpCode.length - 1) {
      setTimeout(() => {
        const nextInput = document.querySelector(`#otp-${index + 1}`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }, 0);
    }
  }

  onPaste(event: ClipboardEvent, startIndex: number): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text').trim() || '';
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, 6 - startIndex);

    digits.forEach((digit, i) => {
      if (startIndex + i < this.otpCode.length) {
        this.otpCode[startIndex + i] = digit;
      }
    });

    // Enfocar el siguiente campo vacío o el último
    const nextIndex = Math.min(startIndex + digits.length, this.otpCode.length - 1);
    setTimeout(() => {
      const nextInput = document.querySelector(`#otp-${nextIndex}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }, 0);
  }
}
