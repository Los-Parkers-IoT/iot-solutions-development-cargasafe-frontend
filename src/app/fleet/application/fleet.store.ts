// src/app/fleet/application/fleet.store.ts
import { inject, Injectable } from '@angular/core';
import {BehaviorSubject, finalize, tap} from 'rxjs';
import { createAsyncState } from '../../shared/helpers/lazy-resource';

import { Device } from '../domain/model/device.model';
import { Vehicle } from '../domain/model/vehicle.model';
import { DevicesApi } from '../infrastructure/devices-api';
import { VehiclesApi } from '../infrastructure/vehicles-api';

@Injectable({ providedIn: 'root' })
export class FleetStore {
  private devicesApi = inject(DevicesApi);
  private vehiclesApi = inject(VehiclesApi);

  // estados "tipo TripsStore"
  readonly devicesState  = createAsyncState<Device[]>([]);
  readonly deviceState   = createAsyncState<Device | null>(null);
  readonly vehiclesState = createAsyncState<Vehicle[]>([]);
  readonly vehicleState  = createAsyncState<Vehicle | null>(null);

  // 👇 streams para la UI (reemplazo del Facade)
  private readonly devicesSubject  = new BehaviorSubject<Device[]>([]);
  private readonly vehiclesSubject = new BehaviorSubject<Vehicle[]>([]);

  readonly devices$  = this.devicesSubject.asObservable();
  readonly vehicles$ = this.vehiclesSubject.asObservable();

  // =====================================================
  //                     DEVICES
  // =====================================================

  loadDevices() {
    this.devicesState.setLoading(true);

    const request$ = this.devicesApi
      .getAll()
      .pipe(
        tap({
          next: (devices) => {
            this.devicesState.setData(devices);
            this.devicesSubject.next(devices);   // 👈 importante
          },
          error: () => this.devicesState.setError('Failed to load devices'),
        }),
        finalize(() => this.devicesState.setLoading(false))
      );

    request$.subscribe();
    return request$;
  }

  loadDeviceById(id: number) {
    this.deviceState.setLoading(true);

    const request$ = this.devicesApi
      .getById(id)
      .pipe(
        tap({
          next: (device) => this.deviceState.setData(device),
          error: () => this.deviceState.setError('Failed to load device'),
        }),
        finalize(() => this.deviceState.setLoading(false))
      );

    request$.subscribe();
    return request$;
  }

  createDevice(device: Device) {
    const request$ = this.devicesApi.create(device).pipe(
      tap({
        next: () => this.loadDevices(),
        error: () => this.devicesState.setError('Failed to create device'),
      })
    );

    request$.subscribe();
    return request$;
  }

  updateDevice(device: Device) {
    const request$ = this.devicesApi.update(device).pipe(
      tap({
        next: () => this.loadDevices(),
        error: () => this.devicesState.setError('Failed to update device'),
      })
    );

    request$.subscribe();
    return request$;
  }

  deleteDevice(id: number) {
    const request$ = this.devicesApi.delete(id).pipe(
      tap({
        next: () => this.loadDevices(),
        error: () => this.devicesState.setError('Failed to delete device'),
      })
    );

    request$.subscribe();
    return request$;
  }

  updateDeviceOnline(id: number, online: boolean) {
    const request$ = this.devicesApi.updateOnline(id, online).pipe(
      tap({
        next: () => this.loadDevices(),
        error: () => this.devicesState.setError('Failed to update device online flag'),
      })
    );

    request$.subscribe();
    return request$;
  }

  updateDeviceFirmware(id: number, firmware: string) {
    const request$ = this.devicesApi.updateFirmware(id, firmware).pipe(
      tap({
        next: () => this.loadDevices(),
        error: () => this.devicesState.setError('Failed to update device firmware'),
      })
    );

    request$.subscribe();
    return request$;
  }

  findDevicesByOnline(online: boolean) {
    this.devicesState.setLoading(true);

    this.devicesApi
      .findByOnline(online)
      .pipe(
        tap({
          next: (devices) => this.devicesState.setData(devices),
          error: () => this.devicesState.setError('Failed to filter devices by online status'),
        }),
        finalize(() => this.devicesState.setLoading(false))
      )
      .subscribe();
  }

  findDeviceByImei(imei: string) {
    this.deviceState.setLoading(true);

    const request$ = this.devicesApi
      .findByImei(imei)
      .pipe(
        tap({
          next: (device) => this.deviceState.setData(device),
          error: () => this.deviceState.setError('Failed to find device by IMEI'),
        }),
        finalize(() => this.deviceState.setLoading(false))
      );

    request$.subscribe();
    return request$;
  }

  // =====================================================
  //                     VEHICLES
  // =====================================================

  loadVehicles() {
    this.vehiclesState.setLoading(true);

    const request$ = this.vehiclesApi
      .getAll()
      .pipe(
        tap({
          next: (vehicles) => {
            this.vehiclesState.setData(vehicles);
            this.vehiclesSubject.next(vehicles); // 👈
          },
          error: () => this.vehiclesState.setError('Failed to load vehicles'),
        }),
        finalize(() => this.vehiclesState.setLoading(false))
      );

    request$.subscribe();
    return request$;
  }

  loadVehicleById(id: number) {
    this.vehicleState.setLoading(true);

    const request$ = this.vehiclesApi
      .getById(id)
      .pipe(
        tap({
          next: (vehicle) => this.vehicleState.setData(vehicle),
          error: () => this.vehicleState.setError('Failed to load vehicle'),
        }),
        finalize(() => this.vehicleState.setLoading(false))
      );

    request$.subscribe();
    return request$;
  }

  createVehicle(vehicle: Vehicle) {
    const request$ = this.vehiclesApi.create(vehicle).pipe(
      tap({
        next: () => this.loadVehicles(),
        error: () => this.vehiclesState.setError('Failed to create vehicle'),
      })
    );

    request$.subscribe();
    return request$;
  }

  updateVehicle(vehicle: Vehicle) {
    const request$ = this.vehiclesApi.update(vehicle).pipe(
      tap({
        next: () => this.loadVehicles(),
        error: () => this.vehiclesState.setError('Failed to update vehicle'),
      })
    );

    request$.subscribe();
    return request$;
  }

  deleteVehicle(id: number) {
    const request$ = this.vehiclesApi.delete(id).pipe(
      tap({
        next: () => this.loadVehicles(),
        error: () => this.vehiclesState.setError('Failed to delete vehicle'),
      })
    );

    request$.subscribe();
    return request$;
  }

  assignDeviceToVehicle(vehicleId: number, imei: string) {
    const request$ = this.vehiclesApi.assignDevice(vehicleId, imei).pipe(
      tap({
        next: () => this.loadVehicles(),
        error: () => this.vehiclesState.setError('Failed to assign device to vehicle'),
      })
    );

    request$.subscribe();
    return request$;
  }

  unassignDeviceFromVehicle(vehicleId: number, imei: string) {
    const request$ = this.vehiclesApi.unassignDevice(vehicleId, imei).pipe(
      tap({
        next: () => this.loadVehicles(),
        error: () => this.vehiclesState.setError('Failed to unassign device from vehicle'),
      })
    );

    request$.subscribe();
    return request$;
  }

  updateVehicleStatus(id: number, status: Vehicle['status']) {
    const request$ = this.vehiclesApi.updateStatus(id, status).pipe(
      tap({
        next: () => this.loadVehicles(),
        error: () => this.vehiclesState.setError('Failed to update vehicle status'),
      })
    );

    request$.subscribe();
    return request$;
  }

  findVehiclesByType(type: Vehicle['type'] | string) {
    this.vehiclesState.setLoading(true);

    this.vehiclesApi
      .findByType(type)
      .pipe(
        tap({
          next: (vehicles) => this.vehiclesState.setData(vehicles),
          error: () => this.vehiclesState.setError('Failed to filter vehicles by type'),
        }),
        finalize(() => this.vehiclesState.setLoading(false))
      )
      .subscribe();
  }

  findVehiclesByStatus(status: Vehicle['status'] | string) {
    this.vehiclesState.setLoading(true);

    this.vehiclesApi
      .findByStatus(status)
      .pipe(
        tap({
          next: (vehicles) => this.vehiclesState.setData(vehicles),
          error: () => this.vehiclesState.setError('Failed to filter vehicles by status'),
        }),
        finalize(() => this.vehiclesState.setLoading(false))
      )
      .subscribe();
  }

  findVehicleByPlate(plate: string) {
    this.vehicleState.setLoading(true);

    const request$ = this.vehiclesApi
      .findByPlate(plate)
      .pipe(
        tap({
          next: (vehicle) => this.vehicleState.setData(vehicle),
          error: () => this.vehicleState.setError('Failed to find vehicle by plate'),
        }),
        finalize(() => this.vehicleState.setLoading(false))
      );

    request$.subscribe();
    return request$;
  }
}
