// application/use-cases/update-device-firmware.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../../domain/model/device.model';
import { DeviceHttpRepository } from '../../infrastructure/http/device.http-repository';

@Injectable({ providedIn: 'root' })
export class UpdateDeviceFirmwareUseCase {
  private repo = inject(DeviceHttpRepository);
  execute(id: number, firmware: string): Observable<Device> {
    return this.repo.updateFirmware(id, firmware);
  }
}
