import { Trip } from '../domain/model/trip.entity';
import { TripResource, TripsResponse } from './trip-response';

export class TripAssembler {
  static toEntitiesFromResponse(responses: TripsResponse): Trip[] {
    return responses.trips.map((response) => this.toEntityFromResource(response));
  }

  static toEntityFromResource(resource: TripResource): Trip {
    const createdAt = resource.createdAt ? new Date(resource.createdAt) : new Date();
    const updatedAt = resource.updatedAt ? new Date(resource.updatedAt) : new Date();

    const trip = new Trip({
      id: Number.isFinite(resource.id as any) ? (resource.id as any as number) : 0,
      driverId: resource.driverId,
      vehicleId: resource.vehicleId,
      createdAt,
      updatedAt,
      completedAt: resource.completedAt ? new Date(resource.completedAt) : null,
      startedAt: resource.startedAt ? new Date(resource.startedAt) : null,
      merchantId: resource.merchantId,
      originPointId: resource.originPointId,
    });

    return trip;
  }
}
