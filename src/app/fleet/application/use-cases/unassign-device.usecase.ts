// unassign-device.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleHttpRepository } from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class UnassignDeviceFromVehicleUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(imei: string): Observable<void> {
    return this.repo.unassignDevice(imei);
  }
}
