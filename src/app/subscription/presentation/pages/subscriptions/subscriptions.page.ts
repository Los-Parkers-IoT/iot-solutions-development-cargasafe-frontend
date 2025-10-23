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
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CancelSubscriptionDialog} from '../../dialogs/cancel-subscription.dialog';
import { ChangePlanDialog} from '../../dialogs/change-plan.dialog';
import { Plan } from '../../../domain/plan';
import { Router } from '@angular/router';

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
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './subscriptions.page.html',
  styleUrl: './subscriptions.page.css',
})
export class SubscriptionsPage implements OnInit {
  private http = inject(HttpClient);
  private API_URL = environment.baseUrl;
  private router = inject(Router);

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

  canViewInvoice = (r: any) => !!r?.hostedInvoiceUrl;
  canDownload = (r: any) => !!(r?.invoicePdfUrl || r?.receiptUrl);

  openExternal(url?: string) {
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  }

  onViewInvoice(r: any) {
    this.openExternal(r?.hostedInvoiceUrl);
  }

  onDownloadReceipt(r: any) {
    const url = r?.invoicePdfUrl || r?.receiptUrl;
    this.openExternal(url);
  }

  private dialog = inject(MatDialog);

  onCancelPlan() {
    this.dialog.open(CancelSubscriptionDialog, {
      width: '480px',
      panelClass: 'cancel-plan-dialog'
    }).afterClosed().subscribe((confirm: boolean) => {
      if (!confirm) return;

      //simluacion de la cancelacion, por el momento
      this.sub.update(s => s ? {...s, status: 'CANCELED'} : s);

      //toda la parte del backend cuando se realice
    });
  }

  onChangePlan() {
    //se obtienen los planes
    this.http.get<Plan[]>(`${this.API_URL}/plans`).subscribe((plans) => {
      const currentPlanId = this.sub()?.planId ?? this.sub()?.plan?.id ?? this.sub()?.id;

    //se abre el modal
    this.dialog.open(ChangePlanDialog, {
      width: '1120px',
      maxWidth: '96vw',
      maxHeight: '90vh',
      panelClass: 'change-plan-dialog',
      autoFocus: false,
      data: {plans, currentPlanId}
    }).afterClosed().subscribe((chosen: Plan | null) => {
      if (!chosen) return;

      //simulacion, luego se conecta con el back
      this.sub.update(s => s ? {
        ...s,
        planId: chosen.id,
        planName: chosen.name ?? chosen.id,
        amount: chosen.price,
        status: 'ACTIVE'
      } : s);
    });

    });
  }


  onChangeCard() {
    this.router.navigate(['/subscriptions/change-card']);
  }
}
