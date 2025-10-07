import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Alert } from '../../models/alert.model';
import { AlertsService } from '../../services/alert.service';
import { AlertTableComponent } from '../alert-table/alert-table.component';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule, AlertTableComponent],
  templateUrl: './alerts-page.component.html',
  styleUrls: ['./alerts-page.component.css'],
})
export class AlertsPageComponent implements OnInit {
  alerts$!: Observable<Alert[]>;

  constructor(private alertsService: AlertsService) {}

  ngOnInit() {
    this.alerts$ = this.alertsService.getAlerts();
  }

  get activeCount$(): Observable<number> {
    return new Observable(observer => {
      this.alerts$.subscribe(alerts =>
        observer.next(alerts.filter(a => a.status === 'Active').length)
      );
    });
  }

  get resolvedCount$(): Observable<number> {
    return new Observable(observer => {
      this.alerts$.subscribe(alerts =>
        observer.next(alerts.filter(a => a.status === 'Closed').length)
      );
    });
  }
}
