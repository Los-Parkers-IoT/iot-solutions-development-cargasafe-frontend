import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { registerBillingIcons } from '../../icons/billing-icons';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-subscriptions-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './subscriptions.page.html',
  styleUrl: './subscriptions.page.css',
})
export class SubscriptionsPage implements OnInit {
  private http = inject(HttpClient);
  private API_URL = environment.baseUrl;

  // 👇 registramos íconos locales SOLO para esta feature
  constructor() {
    const reg = inject(MatIconRegistry);
    const san = inject(DomSanitizer);
    registerBillingIcons(reg, san);
  }

  loading = signal(true);
  sub = signal<any>(null);
  pm = signal<any>(null);
  invoices = signal<any[]>([]);
  displayed = ['date', 'amount', 'status', 'reference', 'actions'];

  ngOnInit(): void {
    this.loading.set(true);
    this.http.get<any[]>(`${this.API_URL}/subscriptions?accountId=1&_limit=1`).subscribe((s) => {
      this.sub.set(s[0] ?? null);
      if (s[0]?.id) {
        this.http
          .get<any[]>(`${this.API_URL}/invoices?subscriptionId=${s[0].id}&_sort=date&_order=desc`)
          .subscribe((rows) => this.invoices.set(rows));
      }
      this.http
        .get<any[]>(`${this.API_URL}/paymentMethods?accountId=1&_limit=1`)
        .subscribe((pm) => this.pm.set(pm[0] ?? null));
      this.loading.set(false);
    });
  }

  get amountLabel(): string {
    const s = this.sub();
    if (!s) return '—';
    const intl = new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: s.currency || 'PEN',
    });
    return `${intl.format(s.amount)}/month`;
  }
  get pmMask(): string {
    const p = this.pm();
    return p ? `${p.brand} ***${p.last4}` : 'No card linked';
  }

  onCancelPlan() {}
  onChangePlan() {}
  onChangeCard() {}
  onDownloadReceipt(r: any) {
    if (r?.receiptUrl) window.open(r.receiptUrl, '_blank');
  }
}
