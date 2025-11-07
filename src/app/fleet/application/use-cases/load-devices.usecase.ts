// load-devices.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../../domain/model/device.model';
import { DeviceHttpRepository } from '../../infrastructure/http/device.http-repository';

@Injectable({ providedIn: 'root' })
export class LoadDevicesUseCase {
  private repo = inject(DeviceHttpRepository);
  execute(): Observable<Device[]> {
    return this.repo.getAll();
  }
}
