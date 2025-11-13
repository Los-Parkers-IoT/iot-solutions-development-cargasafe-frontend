import { Trip } from '../domain/model/trip.entity';
import { DeliveryOrderAssembler } from './delivery-order-assembler';
import { OriginPointAssembler } from './origin-point-assembler';
import { TripResource, TripsResponse } from './trip-response';

export class TripAssembler {
  static toEntitiesFromResponse(responses: TripsResponse): Trip[] {
    return responses.trips.map((response) => this.toEntityFromResource(response));
  }

  static toEntityFromResource(resource: TripResource): Trip {
    const trip = new Trip({
      id: Number.isFinite(resource.id as any) ? (resource.id as any as number) : 0,
      driverId: resource.driverId,
      vehicleId: resource.vehicleId,
      createdAt: new Date(resource.createdAt),
      updatedAt: new Date(resource.updatedAt),
      completedAt: resource.completedAt ? new Date(resource.completedAt) : null,
      startedAt: resource.startedAt ? new Date(resource.startedAt) : null,
      merchantId: resource.merchantId,
      originPointId: resource.originPoint.id,
      originPoint: OriginPointAssembler.toEntityFromResource(resource.originPoint),
      deliveryOrders: resource.deliveryOrders.map(DeliveryOrderAssembler.toEntityFromResource),
    });

    return trip;
  }
}
