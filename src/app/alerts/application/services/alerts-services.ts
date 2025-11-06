import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert } from '../../domain/models/alert.model';
import { environment } from '../../../../environments/environment';
import { AlertAssembler } from '../../infrastructure/alert-assembler';
import { AlertResource } from '../../infrastructure/alert-response';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  private alertsUrl = `${environment.baseUrl}${environment.alertsEndpointPath}`;

  constructor(private http: HttpClient) {
    this.loadAlerts();
  }

  /** Load Alerts */
  loadAlerts(): void {
    this.http.get<AlertResource[]>(this.alertsUrl).subscribe({
      next: (resources) => {
        const entities = resources.map(AlertAssembler.toEntityFromResource);
        this.alertsSubject.next(entities);
      },
      error: (err) => console.error('Error loading alerts:', err),
    });
  }

  /** Get Alerts */
  getAlerts(): Observable<Alert[]> {
    return this.alertsSubject.asObservable();
  }

  /** Mark Acknowledge */
  acknowledgeAlert(id: number): void {
    const url = `${this.alertsUrl}/${id}/acknowledge`;
    this.http.patch<AlertResource>(url, {}).subscribe({
      next: (resource) => {
        const updatedAlert = AlertAssembler.toEntityFromResource(resource);
        this.replaceAlertInList(updatedAlert);
      },
      error: (err) => console.error('Error acknowledging alert:', err),
    });
  }

  /** Mark Closed */
  closeAlert(id: number): void {
    const url = `${this.alertsUrl}/${id}/close`;
    this.http.patch<AlertResource>(url, {}).subscribe({
      next: (resource) => {
        const updatedAlert = AlertAssembler.toEntityFromResource(resource);
        this.replaceAlertInList(updatedAlert);
      },
      error: (err) => console.error('Error closing alert:', err),
    });
  }

  private replaceAlertInList(updatedAlert: Alert): void {
    const alerts = this.alertsSubject.value;
    const index = alerts.findIndex(a => a.id === updatedAlert.id);
    if (index !== -1) {
      alerts[index] = updatedAlert;
      this.alertsSubject.next([...alerts]);
    }
  }
}
