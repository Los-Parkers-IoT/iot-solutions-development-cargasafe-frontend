import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Router } from '@angular/router';
import {DeviceService} from '../../../data-access/services/device.service';
import {Device} from '../../../domain/model/device.model';
import {DeviceFormDialogComponent} from '../../components/device-form-dialog/device-form-dialog.component';


@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatTooltipModule, MatIconModule, MatButtonModule,
    MatDialogModule,
    //  para búsqueda y filtro
    MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule,
  ],
  templateUrl: './device-management.html',
  styleUrls: ['./device-management.css']
})
export class DeviceManagementComponent implements OnInit, AfterViewInit {
  private dialog = inject(MatDialog);
  service = inject(DeviceService);

  constructor(private router: Router) {}

  columns: string[] = ['id', 'imei', 'type', 'online', 'vehiclePlate', 'actions'];
  dataSource = new MatTableDataSource<Device>([]);

  // 🔎 filtros
  searchTerm = '';
  stateFilter = ''; // '', 'Online', 'Offline', 'Not synced'

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    // filtro compuesto: texto + estado
    this.dataSource.filterPredicate = (row, filterStr) => {
      const f = JSON.parse(filterStr) as { q: string; state: string };
      const toL = (s: string | null | undefined) => (s ?? '').toLowerCase();

      // Texto libre: IMEI, Type, Vehicle
      const q = toL(f.q);
      const matchesQ =
        !q ||
        toL(row.imei).includes(q) ||
        toL(row.type).includes(q) ||
        toL(row.vehiclePlate).includes(q);

      // Estado mostrado (string)
      const currentState = row.online ? 'Online' : (row as any).connectivity ?? 'Offline';
      // ^ si no tienes "connectivity" en el modelo, quedará Online/Offline.
      const matchesState = !f.state || currentState === f.state;

      return matchesQ && matchesState;
    };

    this.fetch();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // NAV
  onView(r: Device) { void this.router.navigate(['/fleet/devices', r.id]); }

  // CREATE
  openCreateDialog(): void {
    const empty: Device = {
      imei: '',
      type: 'Temp + GPS',
      firmware: 'v1.0.0',
      online: false,
      vehiclePlate: null
    };
    const ref = this.dialog.open(DeviceFormDialogComponent, {
      width: '920px', maxWidth: '95vw',
      data: { editMode: false, data: empty },
      autoFocus: false
    });
    ref.afterClosed().subscribe(res => {
      if (res?.action === 'add' && res.payload) {
        this.service.create(res.payload).subscribe(() => this.fetch());
      }
    });
  }

  // EDIT
  onEdit(row: Device): void {
    const ref = this.dialog.open(DeviceFormDialogComponent, {
      width: '920px', maxWidth: '95vw',
      data: { editMode: true, data: { ...row } },
      autoFocus: false
    });
    ref.afterClosed().subscribe(res => {
      if (res?.action === 'update' && res.payload) {
        this.service.update(res.payload).subscribe(() => this.fetch());
      }
    });
  }

  // DELETE
  onDelete(row: Device): void {
    if (row.id) this.service.delete(row.id).subscribe(() => this.fetch());
  }

  private fetch(): void {
    this.service.getAll().subscribe(rows => {
      this.dataSource.data = rows;
      this.applyFilters(); // re-evalúa si ya había texto o estado
    });
  }

  // handlers de la UI
  applySearch(value: string)   { this.searchTerm = value; this.applyFilters(); }
  applyState(value: string)    { this.stateFilter = value; this.applyFilters(); }

  private applyFilters(): void {
    this.dataSource.filter = JSON.stringify({
      q: this.searchTerm.trim(),
      state: this.stateFilter,
    });
  }
}
