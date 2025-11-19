import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../../domain/model/device.model';
import { DeviceHttpRepository } from '../../infrastructure/http/device.http-repository';

@Injectable({ providedIn: 'root' })
export class UpdateDeviceUseCase {
  private repo = inject(DeviceHttpRepository);
  execute(payload: Device): Observable<Device> {
    return this.repo.update(payload);
  }
}
