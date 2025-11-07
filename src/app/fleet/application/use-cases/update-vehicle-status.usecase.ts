// update-vehicle-status.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import { VehicleHttpRepository } from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class UpdateVehicleStatusUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(id: number, status: Vehicle['status']): Observable<Vehicle> {
    return this.repo.updateStatus(id, status);
  }
}
