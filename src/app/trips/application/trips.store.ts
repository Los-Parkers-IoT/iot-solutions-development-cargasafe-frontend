import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { Trip } from '../domain/model/trip.entity';
import { TripsApi } from '../infrastructure/trips-api';
import { TotalTripSummary } from './dto/trip-summary.dto';
import { finalize, firstValueFrom, tap } from 'rxjs';
import { createAsyncState } from '../../shared/helpers/lazy-resource';

@Injectable({ providedIn: 'root' })
export class TripsStore {
  private tripsApi = inject(TripsApi);
  readonly tripsState = createAsyncState<Trip[]>([]);
  readonly totalTripsSummaryState = createAsyncState<TotalTripSummary | null>(null);

  loadTrips() {
    this.tripsState.setLoading(true);
    this.tripsApi
      .getTrips()
      .pipe(
        tap({
          next: (trips) => {
            this.tripsState.setData(trips);
            console.log('TripsStore: loaded trips', trips);
          },
          error: () => {
            this.tripsState.setError('Failed to load trips');
          },
        }),
        finalize(() => {
          this.tripsState.setLoading(false);
        })
      )
      .subscribe();
  }

  loadTotalTripsSummary() {
    this.totalTripsSummaryState.setLoading(true);

    this.tripsApi
      .getTotalTripsSummary()
      .pipe(
        tap({
          next: (summary) => {
            this.totalTripsSummaryState.setData(summary);
          },
          error: () => {
            this.totalTripsSummaryState.setError('Failed to load total trips summary');
          },
        }),
        finalize(() => {
          this.totalTripsSummaryState.setLoading(false);
        })
      )
      .subscribe();
  }
}
