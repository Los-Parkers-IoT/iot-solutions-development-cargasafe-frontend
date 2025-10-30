import { DeliveryOrder } from '../domain/model/delivery-order.entity';
import { DeliveryOrderResource } from './delivery-order-response';

export class DeliveryOrderAssembler {
  static toEntitiesFromResources(resources: DeliveryOrderResource[]): DeliveryOrder[] {
    return resources.map((resource: DeliveryOrderResource) => this.toEntityFromResource(resource));
  }

  static toEntityFromResource(resource: DeliveryOrderResource): DeliveryOrder {
    return new DeliveryOrder({
      id: resource.id,
      clientEmail: resource.clientEmail,
      address: resource.address,
      latitude: resource.latitude,
      longitude: resource.longitude,
      sequenceOrder: resource.sequenceOrder,
      arrivalAt: new Date(resource.arrivalAt),
      notes: resource.notes,
      deliveryOrderStatusId: resource.deliveryOrderStatusId,
      realArrivalAt: resource.realArrivalAt ? new Date(resource.realArrivalAt) : null,
      maxHumidity: resource.maxHumidity,
      minHumidity: resource.minHumidity,
      maxTemperature: resource.maxTemperature,
      minTemperature: resource.minTemperature,
      maxVibration: resource.maxVibration,
      tripId: resource.tripId,
      trip: null,
    });
  }
}
