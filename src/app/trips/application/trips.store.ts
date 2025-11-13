import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { Trip } from '../domain/model/trip.entity';
import { TripsApi } from '../infrastructure/trips-api';
import { TotalTripSummary } from './dto/trip-summary.dto';
import { finalize, firstValueFrom, tap } from 'rxjs';
import { createAsyncState } from '../../shared/helpers/lazy-resource';

@Injectable({ providedIn: 'root' })
export class TripsStore {
  private tripsSignal = signal<Trip[]>([]);
  private tripsApi = inject(TripsApi);
  readonly trips = computed(() => this.tripsSignal());

  readonly totalTripsSummary = createAsyncState<TotalTripSummary>();

  loadTrips() {
    this.tripsSignal.set([
      new Trip({
        id: 1,
        driverId: 101,
        vehicleId: 55,
        createdAt: new Date('2025-01-01T08:00:00Z'),
        updatedAt: new Date('2025-01-01T09:00:00Z'),
        merchantId: 200,
        originPointId: 10,
        completedAt: new Date('2025-01-01T10:00:00Z'),
        startedAt: new Date('2025-01-01T08:30:00Z'),
      }),
    ]);
  }

  loadTotalTripsSummary() {
    this.totalTripsSummary.setLoading(true);

    this.tripsApi
      .getTotalTripsSummary()
      .pipe(
        tap({
          next: (summary) => {
            this.totalTripsSummary.setData(summary);
          },
          error: () => {
            this.totalTripsSummary.setError('Failed to load total trips summary');
          },
        }),
        finalize(() => {
          this.totalTripsSummary.setLoading(false);
        })
      )
      .subscribe();
  }
}
