import {inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../../domain/model/vehicle.model';
import {VehicleHttpRepository} from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class FindVehiclesByStatusUseCase {
  private repo = inject(VehicleHttpRepository);
  execute(status: Vehicle['status'] | string) {
    return this.repo.findByStatus(status);
  }
}
