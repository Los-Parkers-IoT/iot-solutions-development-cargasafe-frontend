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
import {VehicleService} from '../../../data-access/services/vehicle.service';

@Component({
  selector: 'app-vehicle-detail-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatListModule],
  templateUrl: './vehicle-detail-page.html',
  styleUrls: ['./vehicle-detail-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDetailPageComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(VehicleService);
  private snack = inject(MatSnackBar, { optional: true });

  private refresh$ = new BehaviorSubject<void>(undefined);

  vehicle$ = this.route.paramMap.pipe(
    map(pm => Number(pm.get('id'))),
    switchMap(id =>
      this.refresh$.pipe(
        switchMap(() => this.service.getById(id)),
      )
    ),
    catchError(err => {
      console.error('[VehicleDetail] error:', err);
      return of(null);
    })
  );

  back() { this.router.navigate(['/fleet/vehicles']); }
  edit(v?: Vehicle | null) {
    if (v?.id) this.router.navigate(['/fleet/vehicles'], { queryParams: { edit: v.id } });
  }

  setAvailable(v: Vehicle) {
    if (!v?.id) return;
    const next: Vehicle = { ...v, status: 'Available' };
    this.service.update(next).subscribe({
      next: () => {
        this.snack?.open('Vehicle set to Available', 'OK', { duration: 2000 });
        this.refresh$.next();
      },
      error: () => this.snack?.open('Could not update status', 'Close', { duration: 2500 })
    });
  }

  setOutOfService(v: Vehicle) {
    if (!v?.id) return;
    const next: Vehicle = { ...v, status: 'Out of Service' };
    this.service.update(next).subscribe({
      next: () => {
        this.snack?.open('Vehicle set Out of Service', 'OK', { duration: 2000 });
        this.refresh$.next();
      },
      error: () => this.snack?.open('Could not update status', 'Close', { duration: 2500 })
    });
  }

  trackByValue = (_: number, val: string) => val;
}
