import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { VehicleRepository } from '../../domain/repositories/vehicle.repository';
import { endpoints } from './endpoints';
import { toVehicle, fromVehicleCreate, fromVehicleUpdate } from '../mappers/vehicle.mapper';
import {Vehicle} from '../../domain/model/vehicle.model';

@Injectable({ providedIn: 'root' })
export class VehicleHttpRepository implements VehicleRepository {
  private http = inject(HttpClient);

  getAll(): Observable<Vehicle[]> {
    return this.http.get<any[]>(endpoints.vehicles).pipe(map(list => list.map(toVehicle)));
  }
  getById(id: number): Observable<Vehicle> {
    return this.http.get<any>(endpoints.vehicleById(id)).pipe(map(toVehicle));
  }
  create(payload: Vehicle): Observable<Vehicle> {
    return this.http.post<any>(endpoints.vehicles, fromVehicleCreate(payload)).pipe(map(toVehicle));
  }
  update(payload: Vehicle): Observable<Vehicle> {
    return this.http.put<any>(endpoints.vehicleById(payload.id!), fromVehicleUpdate(payload)).pipe(map(toVehicle));
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(endpoints.vehicleById(id));
  }

  assignDevice(vehicleId: number, imei: string): Observable<Vehicle> {
    return this.http.post<any>(endpoints.vehicleAssign(vehicleId, imei), {}).pipe(map(toVehicle));
  }
  unassignDevice(imei: string): Observable<void> {
    return this.http.post<void>(endpoints.vehicleUnassign(imei), {});
  }
  updateStatus(id: number, status: Vehicle['status']): Observable<Vehicle> {
    return this.http.patch<any>(endpoints.vehicleStatus(id), { status }).pipe(map(toVehicle));
  }

  findByType(type: Vehicle['type'] | string): Observable<Vehicle[]> {
    return this.http
      .get<any[]>(endpoints.vehiclesByType(String(type).toUpperCase()))
      .pipe(map(list => list.map(toVehicle)));
  }

  findByStatus(status: Vehicle['status'] | string): Observable<Vehicle[]> {
    return this.http
      .get<any[]>(endpoints.vehiclesByStatus(String(status).toUpperCase()))
      .pipe(map(list => list.map(toVehicle)));
  }

  findByPlate(plate: string): Observable<Vehicle> {
    return this.http.get<any>(endpoints.vehicleByPlate(plate)).pipe(map(toVehicle));
  }
}
