// application/use-cases/load-vehicle-by-id.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import { VehicleHttpRepository } from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class LoadVehicleByIdUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(id: number): Observable<Vehicle> {
    return this.repo.getById(id);
  }
}
