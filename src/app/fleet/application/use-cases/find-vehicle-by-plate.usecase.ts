import {inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import {VehicleHttpRepository} from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class FindVehicleByPlateUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(plate: string): Observable<Vehicle> {
    return this.repo.findByPlate(plate);
  }
}
