import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Alert } from '../domain/models/alert.model';
import {environment} from '../../../environments/environment';
import {AlertResource, AlertResponse} from './alert-response';
import {AlertAssembler} from './alert-assembler';

@Injectable({ providedIn: 'root' })
export class AlertsService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  private alertsUrl = `${environment.baseUrl}${environment.alertsEndpointPath}`;

  constructor(private http: HttpClient) {
    this.loadAlerts();
  }

  private loadAlerts(): void {
    this.http.get<AlertResource[]>(this.alertsUrl).subscribe({
      next: (resources) => {
        const entities = resources.map(r => AlertAssembler.toEntityFromResource(r));
        this.alertsSubject.next(entities);
      },
      error: (err) => console.error('Error loading alerts:', err),
    });
  }

  getAlerts(): Observable<Alert[]> {
    return this.alertsSubject.asObservable();
  }

  markAsResolved(id: number) {
    const alert = this.alertsSubject.value.find(a => a.id === id);
    if (!alert) return;

    alert.status = 'Closed';
    alert.closedAt = new Date();

    const updatedAlert = AlertAssembler.toResourceFromEntity(alert);

    this.http.patch(`${this.alertsUrl}/${id}`, updatedAlert).subscribe({
      next: () => this.loadAlerts(),
      error: (err) => console.error('Error updating alert:', err),
    });
  }
}
