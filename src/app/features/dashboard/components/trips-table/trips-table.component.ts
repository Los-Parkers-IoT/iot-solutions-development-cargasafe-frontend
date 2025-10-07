import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trip, TripStatus } from '../../models/trip.model';

@Component({
  selector: 'app-trips-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="trips-table">
      <div class="trips-table__header">
        <h2>Registro de Viajes</h2>
        <div class="trips-table__filters">
          <input 
            type="text" 
            placeholder="Buscar por placa, conductor o destino..." 
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            class="search-input">
          
          <select [(ngModel)]="statusFilter" (change)="applyFilters()" class="status-filter">
            <option value="">Todos los estados</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="COMPLETED">Completado</option>
            <option value="CANCELLED">Cancelado</option>
            <option value="DELAYED">Retrasado</option>
          </select>
        </div>
      </div>

      <div class="trips-table__content" *ngIf="!loading; else loadingTemplate">
        <table class="table">
          <thead>
            <tr>
              <th (click)="sort('vehiclePlate')">
                Placa
                <span class="sort-indicator" [class.active]="sortField === 'vehiclePlate'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th (click)="sort('driverName')">
                Conductor
                <span class="sort-indicator" [class.active]="sortField === 'driverName'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th (click)="sort('origin')">Origen</th>
              <th (click)="sort('destination')">Destino</th>
              <th (click)="sort('cargoType')">Tipo de Carga</th>
              <th (click)="sort('startDate')">
                Fecha Inicio
                <span class="sort-indicator" [class.active]="sortField === 'startDate'">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th (click)="sort('status')">Estado</th>
              <th (click)="sort('distance')">Distancia (km)</th>
              <th>Alertas</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let trip of filteredTrips" class="table-row">
              <td class="vehicle-plate">{{ trip.vehiclePlate }}</td>
              <td>{{ trip.driverName }}</td>
              <td>{{ trip.origin }}</td>
              <td>{{ trip.destination }}</td>
              <td>{{ trip.cargoType }}</td>
              <td>{{ trip.startDate | date:'short' }}</td>
              <td>
                <span class="status-badge" [ngClass]="getStatusClass(trip.status)">
                  {{ getStatusText(trip.status) }}
                </span>
              </td>
              <td>{{ trip.distance | number:'1.0-0' }}</td>
              <td>
                <span class="alerts-count" [ngClass]="{'has-alerts': trip.alerts.length > 0}">
                  {{ trip.alerts.length }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="filteredTrips.length === 0" class="no-data">
          <p>No se encontraron viajes que coincidan con los filtros aplicados.</p>
        </div>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading">
          <p>Cargando viajes...</p>
        </div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./trips-table.component.css']
})
export class TripsTableComponent {
  @Input() trips: Trip[] = [];
  @Input() loading = false;

  filteredTrips: Trip[] = [];
  searchTerm = '';
  statusFilter = '';
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    this.filteredTrips = [...this.trips];
  }

  ngOnChanges() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTrips = this.trips.filter(trip => {
      const matchesSearch = !this.searchTerm || 
        trip.vehiclePlate.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trip.driverName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trip.destination.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trip.origin.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter || trip.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    if (this.sortField) {
      this.applySorting();
    }
  }

  sort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  private applySorting() {
    this.filteredTrips.sort((a, b) => {
      let aValue: any = (a as any)[this.sortField];
      let bValue: any = (b as any)[this.sortField];

      if (this.sortField === 'startDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let result = 0;
      if (aValue < bValue) result = -1;
      if (aValue > bValue) result = 1;

      return this.sortDirection === 'asc' ? result : -result;
    });
  }

  getStatusClass(status: TripStatus): string {
    switch (status) {
      case TripStatus.IN_PROGRESS:
        return 'status-in-progress';
      case TripStatus.COMPLETED:
        return 'status-completed';
      case TripStatus.CANCELLED:
        return 'status-cancelled';
      case TripStatus.DELAYED:
        return 'status-delayed';
      default:
        return '';
    }
  }

  getStatusText(status: TripStatus): string {
    switch (status) {
      case TripStatus.IN_PROGRESS:
        return 'En Progreso';
      case TripStatus.COMPLETED:
        return 'Completado';
      case TripStatus.CANCELLED:
        return 'Cancelado';
      case TripStatus.DELAYED:
        return 'Retrasado';
      default:
        return status;
    }
  }
}