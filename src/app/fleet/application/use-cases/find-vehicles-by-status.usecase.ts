import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import {VehicleHttpRepository} from '../../infrastructure/http/vehicle.http-repository';

export function findVehiclesByStatusUseCase(status: Vehicle['status'] | string): Observable<Vehicle[]> {
  const repo = inject(VehicleHttpRepository);
  return repo.findByStatus(status);
}
