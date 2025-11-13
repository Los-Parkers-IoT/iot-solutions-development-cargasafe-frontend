import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { TripsStore } from '../../../application/trips.store';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Trip } from '../../../domain/model/trip.entity';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TripTotalSummary } from '../../components/trip-total-summary/trip-total-summary';

@Component({
  selector: 'app-trip-list-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    DatePipe,
    DecimalPipe,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TripTotalSummary,
  ],
  templateUrl: './trip-list-page.html',
  styleUrl: './trip-list-page.css',
  standalone: true,
})
export class TripListPage implements OnInit {
  fromDate: Date | null = null;
  toDate: Date | null = null;

  searchTerm: string = '';
  statusFilter: 'all' | '0' | '1' | '2' | '3' = 'all';

  createdOrder: 'desc' | 'asc' = 'desc';

  readonly store = inject(TripsStore);
  trips = computed(() => this.store.tripsState.data);

  displayedColumns: string[] = [
    'id',
    'status',
    'driver',
    'codriver',
    'deliveries',
    'createdAt',
    'departure',
    'actions',
  ];

  dataSource = new MatTableDataSource<Trip>([]);

  constructor() {
    effect(() => {
      const data = this.store.tripsState.data();
      this.dataSource.data = this.sortByCreated([...data], this.createdOrder);
    });

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;

      const { from, to, search, status } = JSON.parse(filter) as {
        from?: string;
        to?: string;
        search?: string;
        status?: string;
      };

      if (from || to) {
        const created = new Date(data.createdAt);

        if (from) {
          const f = new Date(from);
          if (created < f) return false;
        }
        if (to) {
          const t = new Date(to);
          t.setHours(23, 59, 59, 999);
          if (created > t) return false;
        }
      }

      if (status && status !== 'all') {
        if (!this.statusMatches(data.statusId, status)) return false;
      }

      if (search && search.trim().length > 0) {
        const q = search.trim().toLowerCase();

        const idStr = (data.externalId ?? data.id ?? '').toString().toLowerCase();
        const driverStr = (data.driverId ?? '').toString().toLowerCase();
        const coDriverStr = (data.coDriverId ?? '').toString().toLowerCase();
        const statusStr = (data.statusId ?? '').toString().toLowerCase();
        const createdStr = data.createdAt
          ? new Date(data.createdAt).toLocaleString().toLowerCase()
          : '';
        const departureStr = data.departureAt
          ? new Date(data.departureAt).toLocaleString().toLowerCase()
          : '';
        const deliveriesStr = (data.totalDistanceKm ?? '').toString().toLowerCase();

        const hit =
          idStr.includes(q) ||
          driverStr.includes(q) ||
          coDriverStr.includes(q) ||
          statusStr.includes(q) ||
          createdStr.includes(q) ||
          departureStr.includes(q) ||
          deliveriesStr.includes(q);

        if (!hit) return false;
      }

      return true;
    };
  }

  ngOnInit(): void {
    this.store.loadTrips();
  }

  applyDateFilter(): void {
    const payload = JSON.stringify({
      from: this.fromDate ? this.fromDate.toISOString() : undefined,
      to: this.toDate ? this.toDate.toISOString() : undefined,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined,
    });
    this.dataSource.filter = payload + ' ';
  }

  clearDateFilter(): void {
    this.fromDate = null;
    this.toDate = null;
    const payload = JSON.stringify({
      from: undefined,
      to: undefined,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined,
    });
    this.dataSource.filter = payload + ' ';
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.pushFilter();
  }

  onStatusChange(value: 'all' | '0' | '1' | '2' | '3'): void {
    this.statusFilter = value;
    this.pushFilter();
  }

  onCreatedOrderChange(value: 'desc' | 'asc'): void {
    this.createdOrder = value;
    this.dataSource.data = this.sortByCreated([...this.dataSource.data], this.createdOrder);
  }

  private pushFilter(): void {
    const payload = JSON.stringify({
      from: this.fromDate ? this.fromDate.toISOString() : undefined,
      to: this.toDate ? this.toDate.toISOString() : undefined,
      search: this.searchTerm || undefined,
      status: this.statusFilter || undefined,
    });
    this.dataSource.filter = payload + ' ';
  }

  private sortByCreated(items: any[], order: 'desc' | 'asc'): any[] {
    return items.sort((a, b) => {
      const dA = new Date(a.createdAt).getTime();
      const dB = new Date(b.createdAt).getTime();
      return order === 'desc' ? dB - dA : dA - dB;
    });
  }

  private statusMatches(statusId: any, filterCode: string): boolean {
    if (filterCode === 'all') return true;

    const raw = statusId ?? '';
    const code = raw.toString();
    const text = raw.toString().toLowerCase();

    switch (filterCode) {
      case '0':
        return code === '0' || text.includes('complet');
      case '1':
        return code === '1' || text.includes('cancel');
      case '2':
        return (
          code === '2' ||
          text.includes('curso') ||
          text.includes('progress') ||
          text.includes('ongo')
        );
      case '3':
        return code === '3' || text.includes('program');
      default:
        return true;
    }
  }

  isModifyOpen = false;
  isSaving = false;
  selectedTripId: number | null = null;

  currentStatusLabel = 'schedule';
  nextStatusLabel = 'completed';

  showToast = false;
  toastMessage = '';

  openModifyModal(trip: any) {
    this.selectedTripId = Number(trip?.id ?? null);

    this.currentStatusLabel = 'schedule';
    this.nextStatusLabel = 'completed';

    this.isModifyOpen = true;
  }

  closeModifyModal() {
    if (this.isSaving) return;
    this.isModifyOpen = false;
    this.selectedTripId = null;
  }

  toggleNextStatus() {
    const options = ['completed', 'cancelled', 'in course'];
    const i = options.indexOf(this.nextStatusLabel);
    this.nextStatusLabel = options[(i + 1) % options.length];
  }

  confirmModify() {
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
      this.isModifyOpen = false;

      this.toastMessage = `Trip #${this.selectedTripId ?? ''} updated to ${this.nextStatusLabel}`;
      this.showToast = true;
      setTimeout(() => (this.showToast = false), 1800);
    }, 900);
  }
}
