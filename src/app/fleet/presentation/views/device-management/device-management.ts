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
import {Device} from '../../../domain/model/device.model';
import {DeviceCreateAndEditComponent} from '../../components/device-create-and-edit/device-create-and-edit.component';
import {FleetFacade} from '../../../application/services/fleet.facade';


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
  facade = inject(FleetFacade);

  constructor(private router: Router) {}

  columns: string[] = ['id', 'imei', 'online', 'vehiclePlate', 'actions'];
  dataSource = new MatTableDataSource<Device>([]);

  // 🔎 filtros
  searchTerm = '';
  stateFilter = ''; // '', 'Online', 'Offline', 'Not synced'

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.dataSource.filterPredicate = (row, filterStr) => {
      const f = JSON.parse(filterStr) as { q: string; state: string };
      const toL = (s: string | null | undefined) => (s ?? '').toLowerCase();

      const q = toL(f.q);
      const matchesQ =
        !q ||
        toL(row.imei).includes(q) ||
        toL(row.vehiclePlate ?? '').includes(q);                 // ✅ null-safe

      const currentState = row.online ? 'Online' : 'Offline';
      const matchesState = !f.state || currentState === f.state;

      return matchesQ && matchesState;
    };

    // ✅ suscríbete al estado del facade
    this.facade.devices$.subscribe(rows => {
      this.dataSource.data = rows;
      this.applyFilters();
    });
    this.facade.loadDevices();                                   // ✅ dispara carga
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // ⬇️ Accesor de orden para tipos correctos
    this.dataSource.sortingDataAccessor = (item: Device, prop: string) => {
      switch (prop) {
        case 'id':           return item.id ?? 0;               // numérico real
        case 'imei':         return (item.imei ?? '').toString();
        case 'online':       return item.online ? 1 : 0;        // booleans
        case 'vehiclePlate': return item.vehiclePlate ?? '\uffff'; // nulls al final
        default:             return (item as any)[prop] ?? '';
      }
    };

    // ⬇️ Estado inicial: ID asc (o 'desc' si quieres “más nuevo arriba”)
    Promise.resolve().then(() => {
      this.sort.active = 'id';
      this.sort.direction = 'asc';
      this.sort.sortChange.emit({ active: 'id', direction: 'asc' });
    });
  }

  // NAV
  onView(r: Device) { void this.router.navigate(['/fleet/devices', r.id]); }

  // CREATE
  openCreateDialog(): void {
    const ref = this.dialog.open(DeviceCreateAndEditComponent, {
      width: '920px', maxWidth: '95vw',
      data: { editMode: false, data: { imei:'', firmware:'v1.0.0', online:false, vehiclePlate: null } }
    });
    ref.afterClosed().subscribe(res => {
      if (res?.action === 'add' && res.payload) this.facade.createDevice(res.payload); // ✅ sin subscribe extra
    });
  }


  // EDIT
  onEdit(row: Device): void {
    const ref = this.dialog.open(DeviceCreateAndEditComponent, {
      width: '920px', maxWidth: '95vw',
      data: { editMode: true, data: { ...row } }
    });
    ref.afterClosed().subscribe(res => {
      if (res?.action === 'update' && res.payload) this.facade.updateDevice(res.payload); // ✅
    });
  }


  // DELETE
  onDelete(row: Device): void {
    if (row.id) this.facade.deleteDevice(row.id); // ✅
  }

  /*private fetch(): void {
    this.service.getAll().subscribe(rows => {
      this.dataSource.data = rows;
      this.applyFilters(); // re-evalúa si ya había texto o estado
    });
  }*/

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
