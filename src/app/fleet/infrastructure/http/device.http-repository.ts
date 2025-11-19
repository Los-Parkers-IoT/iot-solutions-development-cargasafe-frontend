import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DeviceRepository } from '../../domain/repositories/device.repository';
import { endpoints } from './endpoints';
import {Device} from '../../domain/model/device.model';
import { toDevice, fromDeviceCreate, fromDeviceUpdate } from '../mappers/device.mapper';


@Injectable({ providedIn: 'root' })
export class DeviceHttpRepository implements DeviceRepository {
  private http = inject(HttpClient);

  getAll(): Observable<Device[]> {
    return this.http.get<any[]>(endpoints.devices).pipe(map(list => list.map(toDevice)));
  }
  getById(id: number): Observable<Device> {
    return this.http.get<any>(endpoints.deviceById(id)).pipe(map(toDevice));
  }
  create(payload: Device): Observable<Device> {
    return this.http.post<any>(endpoints.devices, fromDeviceCreate(payload)).pipe(map(toDevice));
  }
  update(payload: Device): Observable<Device> {
    return this.http.put<any>(endpoints.deviceById(payload.id!), fromDeviceUpdate(payload)).pipe(map(toDevice));
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(endpoints.deviceById(id));
  }

  updateFirmware(id: number, firmware: string): Observable<Device> {
    const params = new HttpParams().set('firmware', (firmware ?? '').trim());
    return this.http
      .post<any>(endpoints.deviceFirmware(id), null, { params }) // body null, query param
      .pipe(map(toDevice));
  }
  updateOnline(id: number, online: boolean): Observable<Device> {
    return this.http.patch<any>(endpoints.deviceOnline(id), { online }).pipe(map(toDevice));
  }
  findByOnline(online: boolean): Observable<Device[]> {
    return this.http.get<any[]>(endpoints.devicesByOnline(online)).pipe(map(list => list.map(toDevice)));
  }
  findByImei(imei: string): Observable<Device> {
    return this.http.get<any>(endpoints.deviceByImei(imei)).pipe(map(toDevice));
  }
}
