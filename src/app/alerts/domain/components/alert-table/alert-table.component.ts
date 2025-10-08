import {Component, Input, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Alert } from '../../models/alert.model';
import { AlertsService } from '../../services/alert.service';
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
export class AlertTableComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() alerts: Alert[] | null = [];

  displayedColumns: string[] = [
    'id',
    'type',
    'deliveryOrderId',
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

  constructor(private alertsService: AlertsService) {}

  ngOnInit() {
    if (this.alerts) {
      this.dataSource.data = this.alerts;
    }

    this.dataSource.filterPredicate = (data: Alert, filter: string): boolean => {
      const search = this.searchTerm.toLowerCase();
      const status = this.statusFilter.toLowerCase();

      const matchesSearch =
        !search ||
        data.id.toString().includes(search) ||
        data.type.toLowerCase().includes(search) ||
        data.deliveryOrderId.toLowerCase().includes(search);

      const matchesStatus = !status || data.status.toLowerCase() === status;

      return matchesSearch && matchesStatus;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['alerts'] && this.alerts) {
      this.dataSource.data = this.alerts;
      this.applyCombinedFilter();
    }
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

  markAsResolved(id: string) {
    this.alertsService.markAsResolved(id);
  }
  selectedAlert: Alert | null = null;

  openDetails(alert: Alert) {
    this.selectedAlert = alert;
  }

  closeDetails() {
    this.selectedAlert = null;
  }
}
