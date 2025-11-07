// src/app/fleet/application/fleet.facade.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, of, tap } from 'rxjs';

import {Device} from '../../domain/model/device.model';
import {Vehicle} from '../../domain/model/vehicle.model';
import {DeviceHttpRepository} from '../../infrastructure/http/device.http-repository';
import {VehicleHttpRepository} from '../../infrastructure/http/vehicle.http-repository';

@Injectable({ providedIn: 'root' })
export class FleetFacade {
  // repos
  private deviceRepo  = inject(DeviceHttpRepository);
  private vehicleRepo = inject(VehicleHttpRepository);

  // ----- STATE -----
  private devicesSubject  = new BehaviorSubject<Device[]>([]);
  private vehiclesSubject = new BehaviorSubject<Vehicle[]>([]);
  private loadingSubject  = new BehaviorSubject<boolean>(false);
  private errorSubject    = new BehaviorSubject<string | null>(null);

  /** Public selectors */
  readonly devices$  = this.devicesSubject.asObservable();
  readonly vehicles$ = this.vehiclesSubject.asObservable();
  readonly loading$  = this.loadingSubject.asObservable();
  readonly error$    = this.errorSubject.asObservable();

  // ========== DEVICES ==========
  loadDevices(): void {
    this.spin();
    this.deviceRepo.getAll().pipe(
      tap(list => this.devicesSubject.next(list)),
      catchError(err => { this.fail(err); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  loadDeviceById(id: number): Observable<Device> {
    this.spin();
    return this.deviceRepo.getById(id).pipe(
      finalize(() => this.stop())
    );
  }

  createDevice(payload: Device): void {
    this.spin();
    this.deviceRepo.create(payload).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  updateDevice(payload: Device): void {
    this.spin();
    this.deviceRepo.update(payload).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  deleteDevice(id: number): void {
    this.spin();
    this.deviceRepo.delete(id).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  // extras
  updateDeviceFirmware(id: number, firmware: string): void {
    this.spin();
    this.deviceRepo.updateFirmware(id, firmware).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  updateDeviceOnline(id: number, online: boolean): void {
    this.spin();
    this.deviceRepo.updateOnline(id, online).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  findDevicesByOnline(online: boolean): void {
    this.spin();
    this.deviceRepo.findByOnline(online).pipe(
      tap(list => this.devicesSubject.next(list)),
      catchError(err => { this.fail(err); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  findDeviceByImei(imei: string): Observable<Device> {
    this.spin();
    return this.deviceRepo.findByImei(imei).pipe(
      finalize(() => this.stop())
    );
  }

  // ========== VEHICLES ==========
  loadVehicles(): void {
    this.spin();
    this.vehicleRepo.getAll().pipe(
      tap(list => this.vehiclesSubject.next(list)),
      catchError(err => { this.fail(err); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  loadVehicleById(id: number): Observable<Vehicle> {
    this.spin();
    return this.vehicleRepo.getById(id).pipe(
      finalize(() => this.stop())
    );
  }

  createVehicle(payload: Vehicle): void {
    this.spin();
    this.vehicleRepo.create(payload).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  updateVehicle(payload: Vehicle): void {
    this.spin();
    this.vehicleRepo.update(payload).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  deleteVehicle(id: number): void {
    this.spin();
    this.vehicleRepo.delete(id).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  // extras
  assignDeviceToVehicle(vehicleId: number, imei: string): void {
    this.spin();
    this.vehicleRepo.assignDevice(vehicleId, imei).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  unassignDeviceFromVehicle(imei: string): void {
    this.spin();
    this.vehicleRepo.unassignDevice(imei).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  updateVehicleStatus(id: number, status: Vehicle['status']): void {
    this.spin();
    this.vehicleRepo.updateStatus(id, status).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  findVehiclesByType(type: Vehicle['type'] | string): void {
    this.spin();
    this.vehicleRepo.findByType(type).pipe(
      tap(list => this.vehiclesSubject.next(list)),
      catchError(err => { this.fail(err); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  findVehiclesByStatus(status: Vehicle['status'] | string): void {
    this.spin();
    this.vehicleRepo.findByStatus(status).pipe(
      tap(list => this.vehiclesSubject.next(list)),
      catchError(err => { this.fail(err); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  findVehicleByPlate(plate: string): Observable<Vehicle> {
    this.spin();
    return this.vehicleRepo.findByPlate(plate).pipe(
      finalize(() => this.stop())
    );
    // si quieres que también refresque vehicles$, puedes hacer un tap(...) y next([...one]).
  }

  // ----- helpers -----
  private spin() { this.loadingSubject.next(true); this.errorSubject.next(null); }
  private stop()  { this.loadingSubject.next(false); }
  private fail(err: any) {
    console.error('[FleetFacade]', err);
    this.errorSubject.next(typeof err?.message === 'string' ? err.message : 'Unexpected error');
  }
}
