import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../../domain/model/device.model';
import {environment} from '../../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class DeviceService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/devices`;

  getAll(): Observable<Device[]> { return this.http.get<Device[]>(this.baseUrl); }
  getById(id: number) { return this.http.get<Device>(`${this.baseUrl}/${id}`); } // usa baseUrl
  create(payload: Device): Observable<Device> { return this.http.post<Device>(this.baseUrl, payload); }
  update(payload: Device): Observable<Device> { return this.http.put<Device>(`${this.baseUrl}/${payload.id}`, payload); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/${id}`); }
}
