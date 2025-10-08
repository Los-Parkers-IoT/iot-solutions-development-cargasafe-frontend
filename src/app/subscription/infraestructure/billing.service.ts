import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Subscription } from '../domain/subscription';
import { PaymentMethod } from '../domain/payment-method';
import { Invoice } from '../domain/invoice';
import { Plan } from '../domain/plan';

const API = 'http://localhost:3000/api/v1';
const ACCOUNT_ID = '1';

@Injectable({ providedIn: 'root' })
export class BillingService {
  private http = inject(HttpClient);


  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(`${API}/plans`);
  }


  getCurrentSubscription(): Observable<Subscription | null> {
    const params = new HttpParams().set('accountId', ACCOUNT_ID).set('_limit', 1);
    return this.http.get<Subscription[]>(`${API}/subscriptions`, { params })
      .pipe(map(arr => arr[0] ?? null));
  }


  getPaymentMethod(): Observable<PaymentMethod | null> {
    const params = new HttpParams().set('accountId', ACCOUNT_ID).set('_limit', 1);
    return this.http.get<PaymentMethod[]>(`${API}/paymentMethods`, { params })
      .pipe(map(arr => arr[0] ?? null));
  }


  getInvoices(subscriptionId: number | string): Observable<Invoice[]> {
    const params = new HttpParams()
      .set('subscriptionId', String(subscriptionId))
      .set('_sort', 'date')
      .set('_order', 'desc');
    return this.http.get<Invoice[]>(`${API}/invoices`, { params });
  }
}
