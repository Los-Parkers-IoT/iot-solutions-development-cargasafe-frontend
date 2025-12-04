import { AnalyticsTripResource } from './analytics-trips-response';
import { Trip } from '../domain/model/trip.entity';
import { TripStatus } from '../domain/model/trip-status.vo';

export class TripAssembler {
  static toEntityFromResource(resource: AnalyticsTripResource): Trip {
    const id = resource.tripId ?? resource.id;
    
    const startDate = resource.startDate ? new Date(resource.startDate) : new Date();
    const endDate = resource.endDate ? new Date(resource.endDate) : new Date();
    
    const status = this.parseStatus(resource.status);

    return new Trip(
      id,
      startDate,
      endDate,
      resource.origin,
      resource.destination,
      resource.vehiclePlate,
      resource.driverName,
      resource.cargoType,
      status,
      resource.distance,
      []
    );
  }

  private static parseStatus(status: string): TripStatus {
    switch (status) {
      case 'IN_PROGRESS':
        return TripStatus.IN_PROGRESS;
      case 'COMPLETED':
        return TripStatus.COMPLETED;
      case 'CANCELLED':
        return TripStatus.CANCELLED;
      case 'DELAYED':
        return TripStatus.DELAYED;
      default:
        return TripStatus.IN_PROGRESS;
    }
  }
}


