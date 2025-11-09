// application/use-cases/load-device-by-id.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../../domain/model/device.model';
import { DeviceHttpRepository } from '../../infrastructure/http/device.http-repository';

@Injectable({ providedIn: 'root' })
export class LoadDeviceByIdUseCase {
  private repo = inject(DeviceHttpRepository);
  execute(id: number): Observable<Device> {
    return this.repo.getById(id);
  }
}
