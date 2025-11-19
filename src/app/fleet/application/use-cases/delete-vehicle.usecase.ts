// delete-vehicle.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleHttpRepository } from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class DeleteVehicleUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(id: number): Observable<void> {
    return this.repo.delete(id);
  }
}
