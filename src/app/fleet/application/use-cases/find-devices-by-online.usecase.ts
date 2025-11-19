import {inject, Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Device } from '../../domain/model/device.model';
import {DeviceHttpRepository} from '../../infrastructure/http/device.http-repository';

@Injectable({ providedIn: 'root' })
export class FindDevicesByOnlineUseCase {
  private repo = inject(DeviceHttpRepository);
  execute(online: boolean) {
    return this.repo.findByOnline(online);
  }
}
