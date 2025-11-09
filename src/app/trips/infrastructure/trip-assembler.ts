import { Trip } from '../domain/model/trip.entity';
import { TripResource, TripsResponse } from './trip-response';

export class TripAssembler {
  static toEntitiesFromResponse(responses: TripsResponse): Trip[] {
    return responses.trips.map((response) => this.toEntityFromResource(response));
  }

  static toEntityFromResource(resource: TripResource): Trip {
    const createdAt = resource.createdAt ? new Date(resource.createdAt) : new Date();
    const updatedAt = resource.updatedAt ? new Date(resource.updatedAt) : new Date();

    const departureAt = resource.departureAt
      ? new Date(resource.departureAt)
      : resource.startedAt
      ? new Date(resource.startedAt)
      : null;

    const trip = new Trip({
      id: Number.isFinite(resource.id as any) ? (resource.id as any as number) : 0,
      statusId: resource.statusId,
      driverId: resource.driverId,
      coDriverId: resource.coDriverId,
      vehicleId: resource.vehicleId,
      createdAt,
      updatedAt,
      departureAt,
      merchantId: resource.merchantId,
      originPointId: resource.originPointId,
      polyline_encrypted: resource.polyline_encrypted,
      totalDistanceKm: resource.totalDistanceKm,
      totalDurationMin: resource.totalDurationMin,
    });

    trip.status = resource.status;
    trip.startedAt = resource.startedAt ? new Date(resource.startedAt) : null;
    trip.completedAt = resource.completedAt ? new Date(resource.completedAt) : null;

    return trip;
  }
}
