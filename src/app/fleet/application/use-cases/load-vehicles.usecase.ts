// load-vehicles.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import { VehicleHttpRepository } from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class LoadVehiclesUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(): Observable<Vehicle[]> {
    return this.repo.getAll();
  }
}
