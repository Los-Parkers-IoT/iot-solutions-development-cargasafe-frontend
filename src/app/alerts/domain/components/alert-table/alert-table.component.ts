import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { Alert } from '../../models/alert.model';
import { AlertsService } from '../../services/alert.service';

@Component({
  selector: 'app-alert-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule
  ],
  templateUrl: './alert-table.component.html',
  styleUrls: ['./alert-table.component.css'],
})
export class AlertTableComponent implements OnInit, AfterViewInit {
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

  constructor(private alertsService: AlertsService) {}

  ngOnInit() {
    if (this.alerts) {
      this.dataSource.data = this.alerts;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    if (this.alerts) {
      this.dataSource.data = this.alerts;
    }
  }

  markAsResolved(id: string) {
    this.alertsService.markAsResolved(id);
  }
}
