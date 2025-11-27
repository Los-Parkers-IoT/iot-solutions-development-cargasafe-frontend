import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer } from '@angular/platform-browser';
import { registerBillingIcons } from '../../icons/billing-icons';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CancelSubscriptionDialog } from '../../dialogs/cancel-subscription.dialog';
import { ChangePlanDialog } from '../../dialogs/change-plan.dialog';
import { Plan } from '../../../domain/plan';
import { BillingService, SubscriptionVm } from '../../../infraestructure/billing.service';
import { PaymentService } from '../../../infrastructure/payment.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatSnackBarModule,
  ],

  templateUrl: './subscriptions.page.html',
  styleUrls: ['./subscriptions.page.css'],
})

export class SubscriptionsPage implements OnInit {
  private matIcons = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private dialog = inject(MatDialog);
  private billing = inject(BillingService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loading = signal(true);
  processingPayment = signal(false);

  sub = signal<SubscriptionVm | null>(null);
  invoices = signal<any[]>([]);
  displayed = ['date', 'amount', 'status', 'reference', 'actions'];

  constructor() {
    registerBillingIcons(this.matIcons, this.sanitizer);
  }

  ngOnInit(): void {
    this.refresh();
  }

  get amountLabel() {
    const s = this.sub();
    if (!s) return '—';
    const amount = (s.amount ?? 0).toFixed(2);
    const currency = s.currency ?? 'PEN';
    return `${currency} ${amount}`;
  }

  get currentPlanName(){
    const s = this.sub();
    if (!s) return '-';
    return s.plan?.name ?? '-';
  }

  get renewalDateLabel() {
    const s = this.sub();
    if (!s) return '-';
    return new Date(s.renewalDate).toLocaleDateString();
  }

  private refresh() {
    this.loading.set(true);

    this.billing.getSubscription().subscribe({
      next: (s) => this.sub.set(s),
      error: () => {
        this.sub.set(null);
      },
    });

      this.billing.getPayments().subscribe({
      next: (list) => this.invoices.set(list),
      complete: () => this.loading.set(false),
    });
  }

  onCancel() {
    const ref = this.dialog.open(CancelSubscriptionDialog);
    ref.afterClosed().subscribe((ok: boolean) => {
      if (!ok) return;
      const s = this.sub();
      if (!s) return;
      this.billing.cancelSubscription(s.id).subscribe({
        next: () => {
          this.sub.update((curr) =>
            curr
              ? {
                ...curr,
                status: 'CANCELED',
              }
              : curr
          );
        },
      });
    });
  }

  onChangePlan() {
    this.billing.getPlans().subscribe((plans: Plan[]) => {
      const currentPlanId =
        this.sub()?.plan?.id ?? this.sub()?.planId ?? '';

      const ref = this.dialog.open(ChangePlanDialog, {
        data: { plans, currentPlanId },
      });

      ref.afterClosed().subscribe(async (selectedPlan: Plan | undefined) => {
        if (!selectedPlan) return;

        const s = this.sub();
        if (!s) return;

        if (String(selectedPlan.id) === String(currentPlanId)) return;
        
        // Mostrar loading
        this.processingPayment.set(true);
        
        try {
          // Procesar pago con Izipay
          const paymentResult = await this.paymentService.processPayment(
            selectedPlan.price,
            'bf89c25a-3ed4-4a00-96bd-59cde2ced8c0' // tenantId fijo por ahora
          );
          
          if (paymentResult.success) {
            // Pago exitoso, proceder con el cambio de plan
            this.billing
              .changePlan(s.id, Number(selectedPlan.id))
              .subscribe({
                next: (updated) => {
                  this.sub.set(updated);
                  this.snackBar.open(
                    `Plan cambiado exitosamente a ${selectedPlan.name}`, 
                    'Cerrar', 
                    { duration: 5000 }
                  );
                },
                error: (error) => {
                  console.error('Error al cambiar plan:', error);
                  this.snackBar.open(
                    'Error al actualizar el plan. Contacta soporte.', 
                    'Cerrar', 
                    { duration: 5000 }
                  );
                },
                complete: () => {
                  this.processingPayment.set(false);
                }
              });
          } else {
            // Error en el pago
            this.processingPayment.set(false);
            this.snackBar.open(
              paymentResult.error || 'Error en el procesamiento del pago', 
              'Cerrar', 
              { duration: 5000 }
            );
          }
        } catch (error) {
          this.processingPayment.set(false);
          console.error('Error en el proceso de pago:', error);
          this.snackBar.open(
            'Error al procesar el pago. Intenta nuevamente.', 
            'Cerrar', 
            { duration: 5000 }
          );
        }
      });
    });
  }

  onChangeCard() {
    this.router.navigate(['/subscriptions/change-card']);
  }

  canDownload(row: any): boolean {
    return !!row?.receiptUrl;
  }

  onDownloadReceipt(row: any) {
    if (!row?.receiptUrl) return;
    window.open(row.receiptUrl, '_blank');
  }

  canViewInvoice(row: any): boolean {
    return !!row?.hostedInvoiceUrl || !!row?.invoicePdfUrl;
  }

  onViewInvoice(row: any) {
    const url = row?.hostedInvoiceUrl || row?.invoicePdfUrl;
    if (!url) return;
    window.open(url, '_blank');
  }

  protected readonly name = name;
}
