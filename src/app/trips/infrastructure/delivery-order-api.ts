import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { DeliveryOrder } from '../domain/model/delivery-order.entity';
import { HttpClient } from '@angular/common/http';
import { DeliveryOrderAssembler } from './delivery-order-assembler';
import { DeliveryOrderResource } from './delivery-order-response';

@Injectable({ providedIn: 'root' })
export class DeliveryOrdersApi {
  private baseUrl = environment.baseUrl;
  private deliveryOrdersEndpoint = environment.deliveryOrdersEndpointPath;
  private http = inject(HttpClient);

  getAll(): Observable<DeliveryOrder[]> {
    return this.http
      .get<DeliveryOrderResource[]>(this.deliveryOrdersEndpoint)
      .pipe(map((resources) => DeliveryOrderAssembler.toEntitiesFromResources(resources)));
  }
}
