// create-vehicle.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import { VehicleHttpRepository } from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class CreateVehicleUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(payload: Vehicle): Observable<Vehicle> {
    return this.repo.create(payload);
  }
}
