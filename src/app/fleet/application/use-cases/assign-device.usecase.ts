// assign-device.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import { VehicleHttpRepository } from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class AssignDeviceToVehicleUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(vehicleId: number, imei: string): Observable<Vehicle> {
    return this.repo.assignDevice(vehicleId, imei);
  }
}
