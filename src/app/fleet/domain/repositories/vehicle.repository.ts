import { Observable } from 'rxjs';
import {Vehicle} from '../model/vehicle.model';

export abstract class VehicleRepository {
  // CRUD
  abstract getAll(): Observable<Vehicle[]>;
  abstract getById(id: number): Observable<Vehicle>;
  abstract create(payload: Vehicle): Observable<Vehicle>;
  abstract update(payload: Vehicle): Observable<Vehicle>;
  abstract delete(id: number): Observable<void>;

  // Extras
  abstract assignDevice(vehicleId: number, imei: string): Observable<Vehicle>;
  abstract unassignDevice(imei: string): Observable<void>;
  abstract updateStatus(id: number, status: Vehicle['status']): Observable<Vehicle>;
  abstract findByType(type: Vehicle['type'] | string): Observable<Vehicle[]>;
  abstract findByStatus(status: Vehicle['status'] | string): Observable<Vehicle[]>;
  abstract findByPlate(plate: string): Observable<Vehicle>;
}
