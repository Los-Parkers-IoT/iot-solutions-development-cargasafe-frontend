import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Alert } from '../../../domain/models/alert.model';
import { AlertsService } from '../../../application/services/alerts-services';
import { AlertTableComponent } from '../../components/alert-table/alert-table.component';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-alerts-page',
  standalone: true,
  imports: [CommonModule, AlertTableComponent, MatIconModule],
  templateUrl: './alerts-page.component.html',
  styleUrls: ['./alerts-page.component.css'],
})
export class AlertsPageComponent implements OnInit {
  alerts$!: Observable<Alert[]>;
  activeCount$!: Observable<number>;
  resolvedCount$!: Observable<number>;

  constructor(private alertsService: AlertsService) {}

  ngOnInit() {
    this.alerts$ = this.alertsService.getAlerts();

    this.activeCount$ = this.alerts$.pipe(
      map((alerts) => alerts.filter((a) => a.alertStatus === 'OPEN').length)
    );

    this.activeCount$ = this.alerts$.pipe(
      map((alerts) => alerts.filter((a) => a.alertStatus !== 'CLOSED').length)
    );

    this.resolvedCount$ = this.alerts$.pipe(
      map((alerts) => alerts.filter((a) => a.alertStatus === 'CLOSED').length)
    );
  }

  onCloseAlert(id: number) {
    this.alertsService.closeAlert(id);
  }

  onAcknowledgeAlert(id: number) {
    this.alertsService.acknowledgeAlert(id);
  }
}
