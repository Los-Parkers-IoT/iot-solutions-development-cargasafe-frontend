import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { defaultVehicle, Vehicle } from '../../../domain/model/vehicle.model';
import { Router } from '@angular/router';
import { VehicleFormDialogComponent } from '../../components/vehicle-form-dialog/vehicle-form-dialog';
import {VehicleService} from '../../../application/services/vehicle.service';

@Component({
  selector: 'app-vehicle-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, MatButtonModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule,
  ],
  templateUrl: './vehicle-management.html',
  styleUrls: ['./vehicle-management.css']
})
export class VehicleManagementComponent implements OnInit, AfterViewInit {
  private dialog = inject(MatDialog);
  service = inject(VehicleService);

  constructor(private router: Router) {}

  // tabla
  columns: string[] = ['id', 'plate', 'type', 'capabilities', 'status', 'deviceImei', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>([]);

  // métricas
  totalCount = 0;
  availableCount = 0;
  inServiceCount = 0;

  // filtros
  searchTerm = '';
  statusFilter = '';
  capabilityFilter = '';
  capabilityOptions: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    // Filtro compuesto (texto libre + estado + capability)
    this.dataSource.filterPredicate = (row, filterStr) => {
      const f = JSON.parse(filterStr) as { q: string; status: string; cap: string };
      const toL = (s: string | null | undefined) => (s ?? '').toLowerCase();


      const q = toL(f.q);
      const matchesQ =
        !q ||
        toL(row.plate).includes(q) ||
        toL(row.type).includes(q) ||
        toL(row.deviceImei).includes(q) ||
        (row.capabilities ?? []).some(c => toL(c).includes(q));

      const matchesStatus = !f.status || row.status === f.status;
      const matchesCap    = !f.cap || (row.capabilities ?? []).includes(f.cap);

      return matchesQ && matchesStatus && matchesCap;
    };

    this.fetch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // navegación
  onView(r: Vehicle) {
    this.router.navigate(['/fleet/vehicles', r.id]);
  }

  // crear (dialog)
  openCreateDialog() {
    const empty: Vehicle = { ...defaultVehicle };
    const ref = this.dialog.open(VehicleFormDialogComponent, {
      width: '920px',
      maxWidth: '95vw',
      data: { editMode: false, data: empty },
      autoFocus: false
    });
    ref.afterClosed().subscribe(res => {
      if (res?.action === 'add' && res.payload) {
        this.service.create(res.payload).subscribe(() => this.fetch());
      }
    });
  }

  // editar (dialog)
  onEdit(v: Vehicle): void {
    const model = { ...v, capabilities: Array.isArray(v.capabilities) ? [...v.capabilities] : [] };
    const ref = this.dialog.open(VehicleFormDialogComponent, {
      width: '920px',
      maxWidth: '95vw',
      data: { editMode: true, data: model },
      autoFocus: false
    });
    ref.afterClosed().subscribe(res => {
      if (res?.action === 'update' && res.payload) {
        this.service.update(res.payload).subscribe(() => this.fetch());
      }
    });
  }

  // eliminar
  onDelete(v: Vehicle): void {
    if (v.id) this.service.delete(v.id).subscribe(() => this.fetch());
  }

  // búsqueda + filtros (handlers)
  applySearch(value: string)      { this.searchTerm = value; this.applyFilters(); }
  applyStatus(value: string)      { this.statusFilter = value; this.applyFilters(); }
  applyCapability(value: string)  { this.capabilityFilter = value; this.applyFilters(); }

  private applyFilters(): void {
    this.dataSource.filter = JSON.stringify({
      q: this.searchTerm.trim(),
      status: this.statusFilter,
      cap: this.capabilityFilter,
    });
  }

  // carga y métricas
  private fetch(): void {
    this.service.getAll().subscribe(rows => {
      this.dataSource.data = rows;

      // métricas
      this.totalCount     = rows.length;
      this.availableCount = rows.filter(r => r.status === 'Available').length;
      this.inServiceCount = rows.filter(r => r.status === 'In Service').length;

      // opciones únicas de capability
      const set = new Set<string>();
      rows.forEach(r => (r.capabilities ?? []).forEach(c => set.add(c)));
      this.capabilityOptions = Array.from(set).sort();

      // re-aplicar filtros vigentes
      this.applyFilters();
    });
  }
}
