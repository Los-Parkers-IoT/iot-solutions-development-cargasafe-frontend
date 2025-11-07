// vehicle.mapper.ts
import { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from '../dto/vehicle.dto';
import { Vehicle } from '../../domain/model/vehicle.model';

const toNum = (v: unknown): number | undefined => {
  const n = Number(v); return Number.isFinite(n) ? n : undefined;
};
const arr = <T>(x: T[] | null | undefined, fb: T[] = []) => Array.isArray(x) ? x : fb;

// Backend -> Frontend: deja lo que llega del backend (probablemente mayúsculas)
export const toVehicle = (dto: VehicleDto): Vehicle => ({
  id: toNum(dto.id),
  plate: dto.plate,
  type: dto.type,
  capabilities: arr(dto.capabilities, []),
  status: dto.status,
  odometerKm: Number(dto.odometerKm ?? 0),
  deviceImeis: arr(dto.deviceImeis, []),
});

// Frontend -> Backend: FORZAR MAYÚSCULAS
const U = (s: unknown) => String(s ?? '').trim().toUpperCase();

export const fromVehicleCreate = (m: Vehicle): CreateVehicleDto => ({
  plate: m.plate?.trim(),
  type: U(m.type),
  capabilities: (m.capabilities ?? []).map(U),
  status: U(m.status),
  odometerKm: Number(m.odometerKm ?? 0),
  deviceImeis: m.deviceImeis ?? [],
});

export const fromVehicleUpdate = (m: Vehicle): UpdateVehicleDto =>
  fromVehicleCreate(m);
