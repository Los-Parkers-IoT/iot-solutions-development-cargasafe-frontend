import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, tap } from 'rxjs';

import { Device } from '../../domain/model/device.model';
import { Vehicle } from '../../domain/model/vehicle.model';

// Use cases (inyectamos TODOS los que usas)
import { LoadDevicesUseCase } from '../use-cases/load-devices.usecase';
import { LoadVehiclesUseCase } from '../use-cases/load-vehicles.usecase';
import { CreateDeviceUseCase } from '../use-cases/create-device.usecase';
import { UpdateDeviceOnlineUseCase } from '../use-cases/update-device-online.usecase';
import { UpdateVehicleUseCase } from '../use-cases/update-vehicle.usecase';
import { UpdateVehicleStatusUseCase } from '../use-cases/update-vehicle-status.usecase';
import { DeleteDeviceUseCase } from '../use-cases/delete-device.usecase';
import { DeleteVehicleUseCase } from '../use-cases/delete-vehicle.usecase';
import { AssignDeviceToVehicleUseCase } from '../use-cases/assign-device.usecase';
import { UnassignDeviceFromVehicleUseCase } from '../use-cases/unassign-device.usecase';
import {FindDevicesByOnlineUseCase} from '../use-cases/find-devices-by-online.usecase';
import {FindDeviceByImeiUseCase} from '../use-cases/find-device-by-imei.usecase';
import {FindVehicleByPlateUseCase} from '../use-cases/find-vehicle-by-plate.usecase';
import {FindVehiclesByStatusUseCase,} from '../use-cases/find-vehicles-by-status.usecase';
import {FindVehiclesByTypeUseCase} from '../use-cases/find-vehicles-by-type.usecase';
import {UpdateDeviceUseCase} from '../use-cases/update-device.usecase';
import {UpdateDeviceFirmwareUseCase} from '../use-cases/update-device-firmware.usecase';
import {CreateVehicleUseCase} from '../use-cases/create-vehicle.usecase';
import { LoadDeviceByIdUseCase } from '../use-cases/load-device-by-id.usecase';
import { LoadVehicleByIdUseCase } from '../use-cases/load-vehicle-by-id.usecase';







@Injectable({ providedIn: 'root' })
export class FleetFacade {
  // Use cases
  private loadDevicesUC   = inject(LoadDevicesUseCase);
  private loadVehiclesUC  = inject(LoadVehiclesUseCase);
  private createDeviceUC  = inject(CreateDeviceUseCase);
  private updDevOnlineUC  = inject(UpdateDeviceOnlineUseCase);
  private updVehicleUC    = inject(UpdateVehicleUseCase);
  private updVehStatusUC  = inject(UpdateVehicleStatusUseCase);
  private delDeviceUC     = inject(DeleteDeviceUseCase);
  private delVehicleUC    = inject(DeleteVehicleUseCase);
  private assignDevUC     = inject(AssignDeviceToVehicleUseCase);
  private unassignDevUC   = inject(UnassignDeviceFromVehicleUseCase);
  private updDeviceUC    = inject(UpdateDeviceUseCase);
  private updDevFirmwareUC = inject(UpdateDeviceFirmwareUseCase);
  private createVehicleUC = inject(CreateVehicleUseCase);
  private loadDeviceByIdUC  = inject(LoadDeviceByIdUseCase);
  private loadVehicleByIdUC = inject(LoadVehicleByIdUseCase);
  private findDevByImeiUC  = inject(FindDeviceByImeiUseCase);
  private findDevsOnlineUC = inject(FindDevicesByOnlineUseCase);
  private findVehByPlateUC = inject(FindVehicleByPlateUseCase);
  private findVehByStatusUC= inject(FindVehiclesByStatusUseCase);
  private findVehByTypeUC  = inject(FindVehiclesByTypeUseCase);




  // Signals (store)
  private _devices  = signal<Device[]>([]);
  private _vehicles = signal<Vehicle[]>([]);
  private _loading  = signal(false);
  private _error    = signal<string | null>(null);

  // Selectors (signals + observables)
  readonly devicesSig  = computed(() => this._devices());
  readonly vehiclesSig = computed(() => this._vehicles());
  readonly loadingSig  = computed(() => this._loading());
  readonly errorSig    = computed(() => this._error());

  // Compatibilidad con componentes actuales
  readonly devices$  = toObservable(this.devicesSig);
  readonly vehicles$ = toObservable(this.vehiclesSig);
  readonly loading$  = toObservable(this.loadingSig);
  readonly error$    = toObservable(this.errorSig);

  // Helpers
  private spin() { this._loading.set(true); this._error.set(null); }
  private stop() { this._loading.set(false); }
  private fail(err: any) {
    console.error('[FleetFacade]', err);
    this._error.set(typeof err?.message === 'string' ? err.message : 'Unexpected error');
  }

  // ========== DEVICES ==========
  loadDevices(): void {
    this.spin();
    this.loadDevicesUC.execute().pipe(
      tap(list => this._devices.set(list)),
      catchError(err => { this.fail(err); this._devices.set([]); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  // Lecturas por id/imei: devuelven observable sin tocar store global
  loadDeviceById(id: number) {
    return this.loadDeviceByIdUC.execute(id);   // no spin()/stop(): lectura puntual
  }
  findDeviceByImei(imei: string) { return this.findDevByImeiUC.execute(imei); }

  createDevice(payload: Device): void {
    this.spin();
    this.createDeviceUC.execute(payload).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  updateDevice(payload: Device): void {
    this.spin();
    this.updDeviceUC.execute(payload).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  updateDeviceFirmware(id: number, firmware: string): void {
    this.spin();
    this.updDevFirmwareUC.execute(id, firmware).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }


  updateDeviceOnline(id: number, online: boolean): void {
    this.spin();
    this.updDevOnlineUC.execute(id, online).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  deleteDevice(id: number): void {
    this.spin();
    this.delDeviceUC.execute(id).pipe(
      tap(() => this.loadDevices()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  findDevicesByOnline(online: boolean): void {
    this.spin();
    this.findDevsOnlineUC.execute(online).pipe(
      tap(list => this._devices.set(list)),
      catchError(err => { this.fail(err); this._devices.set([]); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  // ========== VEHICLES ==========
  loadVehicles(): void {
    this.spin();
    this.loadVehiclesUC.execute().pipe(
      tap(list => this._vehicles.set(list)),
      catchError(err => { this.fail(err); this._vehicles.set([]); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  loadVehicleById(id: number) {
    return this.loadVehicleByIdUC.execute(id);  // lectura puntual
  }

  createVehicle(payload: Vehicle): void {
    this.spin();
    // Reutiliza CreateVehicleUseCase si lo tienes; por brevedad uso UpdateVehicleUseCase como ejemplo:
    this.createVehicleUC.execute(payload).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  updateVehicle(payload: Vehicle): void {
    this.spin();
    this.updVehicleUC.execute(payload).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  deleteVehicle(id: number): void {
    this.spin();
    this.delVehicleUC.execute(id).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  assignDeviceToVehicle(vehicleId: number, imei: string): void {
    this.spin();
    this.assignDevUC.execute(vehicleId, imei).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  unassignDeviceFromVehicle(vehicleId: number, imei: string): void {
    this.spin();
    this.unassignDevUC.execute(vehicleId, imei).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  updateVehicleStatus(id: number, status: Vehicle['status']): void {
    this.spin();
    this.updVehStatusUC.execute(id, status).pipe(
      tap(() => this.loadVehicles()),
      catchError(err => { this.fail(err); return of(void 0); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  findVehicleByPlate(plate: string) { return this.findVehByPlateUC.execute(plate); }

  findVehiclesByType(type: Vehicle['type'] | string): void {
    this.spin();
    this.findVehByTypeUC.execute(type).pipe(
      tap(list => this._vehicles.set(list)),
      catchError(err => { this.fail(err); this._vehicles.set([]); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }

  findVehiclesByStatus(status: Vehicle['status'] | string): void {
    this.spin();
    this.findVehByStatusUC.execute(status).pipe(
      tap(list => this._vehicles.set(list)),
      catchError(err => { this.fail(err); this._vehicles.set([]); return of([]); }),
      finalize(() => this.stop())
    ).subscribe();
  }
}
