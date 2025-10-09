import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { DeliveryOrder } from '../domain/model/delivery-order.entity';
import { HttpClient } from '@angular/common/http';
import { DeliveryOrderAssembler } from './delivery-order-assembler';
import { DeliveryOrderResource } from './delivery-order-response';

@Injectable({ providedIn: 'root' })
export class DeliveryOrderApi {
  private baseUrl = environment.baseUrl;
  private deliveryOrdersEndpoint = `/delivery_orders`;
  private http = inject(HttpClient);

  // Fetch all delivery orders for a trip (if tripId provided) or all delivery orders
  getDeliveryOrdersByTripId(tripId?: number): Observable<DeliveryOrder[]> {
    const url = tripId
      ? `${this.baseUrl}${this.deliveryOrdersEndpoint}?tripId=${tripId}`
      : `${this.baseUrl}${this.deliveryOrdersEndpoint}`;

    return this.http
      .get<DeliveryOrderResource[]>(url)
      .pipe(map((resources) => DeliveryOrderAssembler.toEntitiesFromResources(resources)));
  }
}
