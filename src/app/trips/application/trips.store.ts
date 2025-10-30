import { computed, inject, Injectable, signal } from '@angular/core';
import { Trip } from '../domain/model/trip.entity';
import { TripsApi } from '../infrastructure/trips-api';

@Injectable({ providedIn: 'root' })
export class TripsStore {
  private tripsSignal = signal<Trip[]>([]);

  private tripsApi = inject(TripsApi);

  readonly trips = computed(() => this.tripsSignal());

  loadTrips() {
    this.tripsApi.getTrips().subscribe((trips) => {
      console.log('Trips loaded:', trips);
      this.tripsSignal.set(trips);
    });
  }
}
