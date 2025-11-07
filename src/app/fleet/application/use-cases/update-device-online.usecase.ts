// update-device-online.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../../domain/model/device.model';
import { DeviceHttpRepository } from '../../infrastructure/http/device.http-repository';

@Injectable({ providedIn: 'root' })
export class UpdateDeviceOnlineUseCase {
  private repo = inject(DeviceHttpRepository);
  execute(id: number, online: boolean): Observable<Device> {
    return this.repo.updateOnline(id, online);
  }
}
