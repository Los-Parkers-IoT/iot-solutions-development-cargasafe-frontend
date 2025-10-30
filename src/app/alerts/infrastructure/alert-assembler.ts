import {AlertResource, AlertResponse} from './alert-response';
import {Alert} from '../domain/models/alert.model';

export class AlertAssembler{
  static toEntitiesFromResponse(responses: AlertResponse): Alert[]{
    return responses.alerts.map((response)=> this.toEntityFromResource(response))
  }
  static toEntityFromResource(resource: AlertResource): Alert {
    return new Alert({
      id: resource.id,
      type: resource.type,
      deliveryOrderId: resource.deliveryOrderId,
      status: resource.status,
      createdAt: resource.createdAt
        ? new Date(resource.createdAt)
        : new Date(),
      closedAt: resource.closedAt
        ? new Date(resource.closedAt)
        : null,
      description: resource.description,
    });
  }
  static toResourceFromEntity(alert: Alert): AlertResource {
    return {
      id: alert.id,
      type: alert.type,
      deliveryOrderId: alert.deliveryOrderId,
      status: alert.status,
      createdAt: alert.createdAt.toISOString(),
      closedAt: alert.closedAt ? alert.closedAt.toISOString() : undefined,
      description: alert.description,
    };
  }

}

