import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { Device } from '../../../domain/model/device.model';
import { BehaviorSubject, catchError, map, of, switchMap } from 'rxjs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {FleetFacade} from '../../../application/services/fleet.facade';
import {MatDialog} from '@angular/material/dialog';
import {FirmwareDialogComponent} from '../../components/update-firmware-dialog/update-firmware-dialog';
import {AssignVehicleDialogComponent} from '../../components/assign-vehicle-dialog/assign-vehicle-dialog';


@Component({
  selector: 'app-device-detail-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatListModule, MatChipsModule, MatSnackBarModule],
  templateUrl: './device-detail-page.html',
  styleUrls: ['./device-detail-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private facade = inject(FleetFacade);
  private snack = inject(MatSnackBar, { optional: true });
  private dialog = inject(MatDialog);

  private refresh$ = new BehaviorSubject<void>(undefined);

  device$ = this.route.paramMap.pipe(
    map(pm => Number(pm.get('id'))),
    switchMap(id => this.refresh$.pipe(switchMap(() => this.facade.loadDeviceById(id)))),
    catchError(() => of(null))
  );

  back() { this.router.navigate(['/fleet/devices']); }
  edit(d?: Device | null) {
    if (d?.id) this.router.navigate(['/fleet/devices'], { queryParams: { edit: d.id } });
  }

  // Botón "Test Ping"
  testPing(d: Device) {
    // Placeholder de llamado; por ahora solo feedback
    this.snack?.open(`Ping sent to ${d.imei}`, 'OK', { duration: 1800 });
  }

  // Botón "Unlink" — set vehiclePlate = null y update
  unlink(d: Device) {
    if (!d?.imei || !d?.vehiclePlate) return;
    this.facade.findVehicleByPlate(d.vehiclePlate).subscribe(v => {
      if (!v?.id) return;
      this.facade.unassignDeviceFromVehicle(v.id!, d.imei); // POST desde detail
      this.snack?.open('Device unassigned', 'OK', {duration: 1600});
      this.refresh$.next();
    });
  }

  toggleOnline(d: Device) {
    if (!d?.id) return;
    const next = !d.online;
    this.facade.updateDeviceOnline(d.id, next);
    this.snack?.open(`Device set ${next ? 'Online' : 'Offline'}`, 'OK', { duration: 1600 });
    this.refresh$.next();
  }

  openUpdateFirmwareDialog(d: Device) {
    this.dialog.open(FirmwareDialogComponent, {
      width: '480px',
      data: { current: d.firmware }
    }).afterClosed().subscribe((version?: string) => {
      if (version && d.id) {
        this.facade.updateDeviceFirmware(d.id, version);
        this.snack?.open('Firmware updated', 'OK', { duration: 1600 });
        this.refresh$.next();
      }
    });
  }

  openAssignVehicleDialog(d: Device) {
    this.dialog.open(AssignVehicleDialogComponent, {
      width: '520px'
    }).afterClosed().subscribe((vehicleId?: number) => {
      if (vehicleId) {
        this.facade.assignDeviceToVehicle(vehicleId, d.imei); // POST desde detail
        this.snack?.open('Device assigned to vehicle', 'OK', { duration: 1600 });
        this.refresh$.next();
      }
    });
  }

}
