// src/app/fleet/presentation/views/vehicle-detail-page/vehicle-detail-page.ts
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { Vehicle } from '../../../domain/model/vehicle.model';
import { BehaviorSubject, catchError, map, of, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { AssignDeviceDialogComponent } from '../../components/assign-device-dialog/assign-device-dialog';
import { MatDialog } from '@angular/material/dialog';
import { UnassignDeviceDialogComponent } from '../../components/unassign-device-dialog/unassign-device-dialog';
import { FleetStore } from '../../../application/fleet.store';
import {VehicleStatus} from '../../../domain/model/vehicle-status.vo';

@Component({
  selector: 'app-vehicle-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    FormsModule,
  ],
  templateUrl: './vehicle-detail-page.html',
  styleUrls: ['./vehicle-detail-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDetailPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(FleetStore);
  private snack = inject(MatSnackBar, { optional: true });
  private dialog = inject(MatDialog);
  private refresh$ = new BehaviorSubject<void>(undefined);

  vehicle$ = this.route.paramMap.pipe(
    map((pm) => Number(pm.get('id'))),
    switchMap((id) =>
      this.refresh$.pipe(switchMap(() => this.store.loadVehicleById(id)))
    ),
    catchError(() => of(null))
  );

  back() {
    void this.router.navigate(['/fleet/vehicles']);
  }

  edit(v?: Vehicle | null) {
    if (v?.id) {
      void this.router.navigate(['/fleet/vehicles'], { queryParams: { edit: v.id } });
    }
  }

  setAvailable(v: Vehicle) {
    if (!v?.id) return;
    this.store.updateVehicleStatus(v.id, VehicleStatus.IN_SERVICE);
    this.snack?.open('Vehicle set to IN_SERVICE', 'OK', { duration: 2000 });
    this.refresh$.next();
  }

  setOutOfService(v: Vehicle) {
    if (!v?.id) return;
    this.store.updateVehicleStatus(v.id, VehicleStatus.OUT_OF_SERVICE); // 👈 enum
    this.snack?.open('Vehicle set to OUT_OF_SERVICE', 'OK', { duration: 2000 });
    this.refresh$.next();
  }

  trackByValue = (_: number, val: string) => val;

  openAssignDialog(v: Vehicle) {
    if (!v?.id) return;

    const ref = this.dialog.open(AssignDeviceDialogComponent, {
      width: '920px',
      maxWidth: '95vw',
      data: { vehicleId: v.id },
    });

    ref.afterClosed().subscribe((res) => {
      if (res?.imei) {
        this.store.assignDeviceToVehicle(v.id!, res.imei);
        this.snack?.open(`Assigned ${res.imei}`, 'OK', { duration: 1800 });
        this.refresh$.next();
      }
    });
  }

  openUnassignDialog(v: Vehicle) {
    if (!v?.id || !v.deviceImeis?.length) return;

    const ref = this.dialog.open(UnassignDeviceDialogComponent, {
      width: '520px',
      maxWidth: '95vw',
      data: { imeis: v.deviceImeis },
    });

    ref.afterClosed().subscribe((res) => {
      if (res?.imei) {
        this.store.unassignDeviceFromVehicle(v.id!, res.imei);
        this.snack?.open(`Unassigned ${res.imei}`, 'OK', { duration: 1800 });
        this.refresh$.next();
      }
    });
  }

  unassignAll(v: Vehicle) {
    if (!v?.id || !v.deviceImeis?.length) return;

    for (const imei of v.deviceImeis) {
      this.store.unassignDeviceFromVehicle(v.id, imei);
    }
    this.snack?.open('Unassigned all devices', 'OK', { duration: 1800 });
    this.refresh$.next();
  }
}
