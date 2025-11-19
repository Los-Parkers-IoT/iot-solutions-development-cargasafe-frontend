// delete-device.usecase.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DeviceHttpRepository } from '../../infrastructure/http/device.http-repository';

@Injectable({ providedIn: 'root' })
export class DeleteDeviceUseCase {
  private repo = inject(DeviceHttpRepository);
  execute(id: number): Observable<void> {
    return this.repo.delete(id);
  }
}
