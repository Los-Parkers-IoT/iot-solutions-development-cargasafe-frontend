import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { Vehicle } from '../../../domain/model/vehicle.model';
import { BehaviorSubject, catchError, map, of, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FleetFacade } from '../../../application/services/fleet.facade';
import { FormsModule } from '@angular/forms';
import { AssignDeviceDialogComponent } from '../../components/assign-device-dialog/assign-device-dialog';
import { MatDialog } from '@angular/material/dialog';
import { UnassignDeviceDialogComponent } from '../../components/unassign-device-dialog/unassign-device-dialog';

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
  /*private service = inject(VehicleService);*/
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(FleetFacade);
  private snack = inject(MatSnackBar, { optional: true });
  private dialog = inject(MatDialog);
  private refresh$ = new BehaviorSubject<void>(undefined);

  vehicle$ = this.route.paramMap.pipe(
    map((pm) => Number(pm.get('id'))),
    switchMap((id) => this.refresh$.pipe(switchMap(() => this.facade.loadVehicleById(id)))), // ✅ usa refresh$
    catchError(() => of(null))
  );

  back() {
    this.router.navigate(['/fleet/vehicles']);
  }
  edit(v?: Vehicle | null) {
    if (v?.id) this.router.navigate(['/fleet/vehicles'], { queryParams: { edit: v.id } });
  }

  setAvailable(v: Vehicle) {
    if (!v?.id) return;
    this.facade.updateVehicleStatus(v.id, 'IN_SERVICE');
    this.snack?.open('Vehicle set to IN_SERVICE', 'OK', { duration: 2000 });
    this.refresh$.next();
  }

  setOutOfService(v: Vehicle) {
    if (!v?.id) return;
    this.facade.updateVehicleStatus(v.id, 'OUT_OF_SERVICE');
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
        this.facade.assignDeviceToVehicle(v.id!, res.imei);
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
        this.facade.unassignDeviceFromVehicle(v.id!, res.imei);
        this.snack?.open(`Unassigned ${res.imei}`, 'OK', { duration: 1800 });
        this.refresh$.next();
      }
    });
  }

  unassignAll(v: Vehicle) {
    if (!v?.id || !v.deviceImeis?.length) return;
    for (const imei of v.deviceImeis) this.facade.unassignDeviceFromVehicle(v.id, imei);
    this.snack?.open('Unassigned all devices', 'OK', { duration: 1800 });
    this.refresh$.next();
  }
}
