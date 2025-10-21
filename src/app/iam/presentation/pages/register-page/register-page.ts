import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule
  ],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPageComponent {
  segment: 'Client' | 'Shipping Company' = 'Client';

  companyContactEmail: string = '';
  legalName: string = '';
  rucId: string = '';
  fiscalAddress: string = '';

  firstName: string = '';
  lastName: string = '';

  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  termsAccepted: boolean = false;

  constructor(private router: Router) {}

  onRegister(): void {
    if (!this.termsAccepted) {
      alert('You must accept the terms and conditions.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (this.segment === 'Shipping Company' && (!this.legalName || !this.rucId)) {
      alert('Please complete all Company Data fields.');
      return;
    }

    console.log('Registration attempt:', {
      segment: this.segment,
      firstName: this.firstName,
      email: this.email,
      companyData: this.segment === 'Shipping Company' ? { legalName: this.legalName, taxId: this.rucId } : 'N/A'
    });
  }

  onBackToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
