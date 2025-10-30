import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPageComponent {
  segment: 'Client' | 'Shipping Company' = 'Client';

  companyContactEmail: string = '';
  legalName: string = '';
  taxId: string = '';
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

    if (this.segment === 'Shipping Company' && (!this.legalName || !this.taxId)) {
      alert('Please complete all Company Data fields.');
      return;
    }

    console.log('Registration attempt:', {
      segment: this.segment,
      firstName: this.firstName,
      email: this.email,
      companyData: this.segment === 'Shipping Company' ? { legalName: this.legalName, taxId: this.taxId } : 'N/A'
    });

  }

  onBackToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
