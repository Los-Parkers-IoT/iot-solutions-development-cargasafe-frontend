import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Alert } from '../../../domain/models/alert.model';
import { AlertsService } from '../../../application/services/alerts-services';
import {MatIconModule} from '@angular/material/icon';
import {MatFormField, MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-alert-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './alert-table.component.html',
  styleUrls: ['./alert-table.component.css'],
})
export class AlertTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() alerts: Alert[] | null = [];
  @Output() closeAlert = new EventEmitter<number>();
  @Output() acknowledgeAlert = new EventEmitter<number>();

  displayedColumns: string[] = [
    'id',
    'type',
    'status',
    'createdAt',
    'closedAt',
    'actions',
    'details',
  ];

  dataSource = new MatTableDataSource<Alert>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchTerm = '';
  statusFilter = '';

  selectedAlert: Alert | null = null;

  ngOnInit() {
    this.setupFilter();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alerts'] && this.alerts) {
      this.dataSource.data = this.alerts;

      this.dataSource.data.forEach(alert => {
        alert.viewed = localStorage.getItem(`alert-viewed-${alert.id}`) === 'true';
      });

      this.applyCombinedFilter();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setupFilter() {
    this.dataSource.filterPredicate = (data: Alert, _: string): boolean => {
      const search = this.searchTerm.toLowerCase();
      const status = this.statusFilter.toLowerCase();

      const matchesSearch =
        !search ||
        data.id.toString().includes(search) ||
        data.alertType.toLowerCase().includes(search);

      const matchesStatus = !status || data.alertStatus.toLowerCase() === status;
      return matchesSearch && matchesStatus;
    };
  }

  applySearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyCombinedFilter();
  }

  filterByStatus(status: string) {
    this.statusFilter = status;
    this.applyCombinedFilter();
  }

  private applyCombinedFilter() {
    this.dataSource.filter = Math.random().toString();
  }

  markAsResolved(id: number) {
    this.closeAlert.emit(id);
  }

  markAsAcknowledged(id: number) {
    this.acknowledgeAlert.emit(id);
  }

  openDetails(alert: Alert) {
    this.selectedAlert = alert;

    if (!alert.viewed) {
      alert.viewed = true;
      localStorage.setItem(`alert-viewed-${alert.id}`, 'true');

      if (alert.alertStatus === 'OPEN') {
        alert.alertStatus = 'ACKNOWLEDGED';
        this.markAsAcknowledged(alert.id);
      }

      this.dataSource.data = [...this.dataSource.data];
    }
  }

  closeDetails() {
    this.selectedAlert = null;
  }
}
