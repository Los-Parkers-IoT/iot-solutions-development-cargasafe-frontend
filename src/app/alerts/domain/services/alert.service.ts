import { Injectable } from '@angular/core';
import { Alert } from '../models/alert.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private alertsSubject = new BehaviorSubject<Alert[]>([
    {
      id: '#0001',
      type: 'High Temperature',
      deliveryOrderId: 'T342',
      status: 'Active',
      createdAt: '10:45 AM',
    },
    {
      id: '#0002',
      type: 'Excessive vibration',
      deliveryOrderId: 'T343',
      status: 'Closed',
      createdAt: '11:20 AM',
      closedAt: '11:45 AM',
    },
    {
      id: '#0003',
      type: 'Energy Loss',
      deliveryOrderId: 'T344',
      status: 'Closed',
      createdAt: '01:05 PM',
      closedAt: '01:14 PM',
    },
    {
      id: '#0004',
      type: 'Trip Loss',
      deliveryOrderId: 'T345',
      status: 'Closed',
      createdAt: '01:35 PM',
      closedAt: '01:50 PM',
    },
  ]);

  getAlerts(): Observable<Alert[]> {
    return this.alertsSubject.asObservable();
  }

  markAsResolved(id: string) {
    const current: Alert[] = this.alertsSubject.value.map(alert =>
      alert.id === id
        ? ({
          ...alert,
          status: 'Closed' as 'Closed',
          closedAt: new Date().toLocaleTimeString(),
        } as Alert)
        : alert
    );

    this.alertsSubject.next(current);
  }
}
