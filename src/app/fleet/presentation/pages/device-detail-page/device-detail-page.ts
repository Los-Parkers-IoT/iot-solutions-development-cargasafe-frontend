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
import { MatSnackBar } from '@angular/material/snack-bar';
import {DeviceService} from '../../../data-access/services/device.service';

@Component({
  selector: 'app-device-detail-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatListModule, MatChipsModule],
  templateUrl: './device-detail-page.html',
  styleUrls: ['./device-detail-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceDetailPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(DeviceService);
  private snack = inject(MatSnackBar, { optional: true });

  private refresh$ = new BehaviorSubject<void>(undefined);

  device$ = this.route.paramMap.pipe(
    map(pm => Number(pm.get('id'))),
    switchMap(id => this.refresh$.pipe(switchMap(() => this.service.getById(id)))),
    catchError(() => of(null))
  );

  back() { this.router.navigate(['/fleet/devices']); }
  edit(d?: Device | null) {
    if (d?.id) this.router.navigate(['/fleet/devices'], { queryParams: { edit: d.id } });
  }

  // Botón "Link to Vehicle" (placeholder de flujo)
  linkToVehicle(d: Device) {
    // Ejemplo: navegar a listado de vehicles con un query param, o abrir un dialog de selección.
    // Por ahora mostramos feedback.
    this.snack?.open('Link flow coming soon', 'OK', { duration: 2000 });
  }

  // Botón "Test Ping"
  testPing(d: Device) {
    // Placeholder de llamado; por ahora solo feedback
    this.snack?.open(`Ping sent to ${d.imei}`, 'OK', { duration: 1800 });
  }

  // Botón "Unlink" — set vehiclePlate = null y update
  unlink(d: Device) {
    if (!d?.id) return;
    const next: Device = { ...d, vehiclePlate: null };
    this.service.update(next).subscribe({
      next: () => { this.snack?.open('Device unlinked', 'OK', { duration: 1800 }); this.refresh$.next(); },
      error: () => this.snack?.open('Could not unlink device', 'Close', { duration: 2500 })
    });
  }
}
