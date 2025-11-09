// vehicle.mapper.ts
import { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from '../dto/vehicle.dto';
import { Vehicle } from '../../domain/model/vehicle.model';


export const UA = (arr: unknown[], fallback: string[] = []) =>
  (Array.isArray(arr) ? arr : fallback).map(U);
export const toNum = (v: unknown): number | undefined => {
  const n = Number(v); return Number.isFinite(n) ? n : undefined;
};

const arr = <T>(x: T[] | null | undefined, fb: T[] = []) => Array.isArray(x) ? x : fb;


// Backend -> Frontend: deja lo que llega del backend (probablemente mayúsculas)
export const toVehicle = (dto: VehicleDto): Vehicle => ({
  id: toNum(dto.id),
  plate: String(dto.plate ?? '').trim(),
  type: U(dto.type),
  capabilities: UA(dto.capabilities ?? []),
  status: U(dto.status),
  odometerKm: Number(dto.odometerKm ?? 0),
  deviceImeis: Array.isArray(dto.deviceImeis) ? dto.deviceImeis : [],
});


// Frontend -> Backend: FORZAR MAYÚSCULAS
export const U = (s: unknown) => String(s ?? '').trim().toUpperCase();

// Frontend -> Backend (forzamos UPPER_CASE en type/status/capabilities)
export const fromVehicleCreate = (m: Vehicle): CreateVehicleDto => ({
  plate: String(m.plate ?? '').trim(),
  type: U(m.type),
  capabilities: UA(m.capabilities ?? []),
  status: U(m.status),
  odometerKm: Number(m.odometerKm ?? 0),
  deviceImeis: Array.isArray(m.deviceImeis) ? m.deviceImeis : [],
});

export const fromVehicleUpdate = (m: Vehicle): UpdateVehicleDto =>
  fromVehicleCreate(m);
