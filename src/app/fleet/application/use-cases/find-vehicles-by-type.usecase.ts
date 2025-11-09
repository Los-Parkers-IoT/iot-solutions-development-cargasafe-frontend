import {inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import {VehicleHttpRepository} from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class FindVehiclesByTypeUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(type: Vehicle['type'] | string) {
    return this.repo.findByType(type);
  }
}
