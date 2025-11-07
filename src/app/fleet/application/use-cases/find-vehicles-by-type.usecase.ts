import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import {VehicleHttpRepository} from '../../infrastructure/http/vehicle.http-repository';

export function findVehiclesByTypeUseCase(type: Vehicle['type'] | string): Observable<Vehicle[]> {
  const repo = inject(VehicleHttpRepository);
  return repo.findByType(type);
}
