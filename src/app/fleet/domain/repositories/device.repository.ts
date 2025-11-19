import { Observable } from 'rxjs';
import {Device} from '../model/device.model';

export abstract class DeviceRepository {
  // CRUD
  abstract getAll(): Observable<Device[]>;
  abstract getById(id: number): Observable<Device>;
  abstract create(payload: Device): Observable<Device>;
  abstract update(payload: Device): Observable<Device>;
  abstract delete(id: number): Observable<void>;

  // Extras
  abstract updateFirmware(id: number, firmware: string): Observable<Device>;
  abstract updateOnline(id: number, online: boolean): Observable<Device>;
  abstract findByOnline(online: boolean): Observable<Device[]>;
  abstract findByImei(imei: string): Observable<Device>;
}
