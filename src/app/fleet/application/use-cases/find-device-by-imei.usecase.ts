import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../../domain/model/device.model';
import {DeviceHttpRepository} from '../../infrastructure/http/device.http-repository';

export function findDeviceByImeiUseCase(imei: string): Observable<Device> {
  const repo = inject(DeviceHttpRepository);
  return repo.findByImei(imei);
}
