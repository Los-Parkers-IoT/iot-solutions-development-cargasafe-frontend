import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../../domain/model/device.model';
import {DeviceHttpRepository} from '../../infrastructure/http/device.http-repository';

export function updateDeviceFirmwareUseCase(deviceId: number, firmware: string): Observable<Device> {
  const repo = inject(DeviceHttpRepository);
  return repo.updateFirmware(deviceId, firmware);
}
