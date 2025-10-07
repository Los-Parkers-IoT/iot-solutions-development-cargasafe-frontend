import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert } from '../models/alert.model';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  private baseUrl = 'http://localhost:3000/alerts';

  constructor(private http: HttpClient) {
    this.loadAlerts();
  }

  private loadAlerts(): void {
    this.http.get<Alert[]>(this.baseUrl).subscribe({
      next: (alerts) => this.alertsSubject.next(alerts),
      error: (err) => console.error('Error loading alerts:', err),
    });
  }

  getAlerts(): Observable<Alert[]> {
    return this.alertsSubject.asObservable();
  }

  markAsResolved(id: string) {
    const alert = this.alertsSubject.value.find((a) => a.id === id);
    if (!alert) return;

    const updatedAlert = {
      ...alert,
      status: 'Closed' as const,
      closedAt: new Date().toLocaleTimeString(),
    };

    this.http.patch(`${this.baseUrl}/${id}`, updatedAlert).subscribe({
      next: () => {
        this.loadAlerts();
      },
      error: (err) => console.error('Error updating alert:', err),
    });
  }
}
