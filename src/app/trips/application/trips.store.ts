import { computed, inject, Injectable, signal } from '@angular/core';
import { Trip } from '../domain/model/trip.entity';
import { TripsApi } from '../infrastructure/trips-api';

@Injectable({ providedIn: 'root' })
export class TripsStore {
  private tripsSignal = signal<Trip[]>([]);

  private tripsApi = inject(TripsApi);

  readonly trips = computed(() => this.tripsSignal());

  loadTrips() {
    this.tripsSignal.set([
      new Trip({
        id: 1,
        statusId: 1,
        driverId: 101,
        coDriverId: null,
        vehicleId: 55,
        createdAt: new Date('2025-01-01T08:00:00Z'),
        updatedAt: new Date('2025-01-01T09:00:00Z'),
        departureAt: new Date('2025-01-02T06:30:00Z'),
        merchantId: 200,
        originPointId: 10,
        polyline_encrypted: 'enc_polyline_example',
        totalDistanceKm: 350.2,
        totalDurationMin: 420,
      }),
    ]);

    // this.tripsApi.getTrips().subscribe((trips) => {
    //   console.log('Trips loaded:', trips);
    //   this.tripsSignal.set(trips);
    // });
  }
}
