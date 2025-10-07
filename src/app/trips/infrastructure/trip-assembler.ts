import { Trip } from '../domain/model/trip.entity';
import { TripResource, TripsResponse } from './trip-response';

export class TripAssembler {
  static toEntitiesFromResponse(responses: TripsResponse): Trip[] {
    return responses.trips.map((response) => this.toEntityFromResource(response));
  }

  static toEntityFromResource(resource: TripResource): Trip {
    return new Trip({
      id: resource.id,
      driverId: resource.driverId,
      coDriverId: resource.coDriverId,
      vehicleId: resource.vehicleId,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt),
      departureAt: resource.departureAt ? new Date(resource.departureAt) : null,
      merchantId: resource.merchantId,
    });
  }
}
