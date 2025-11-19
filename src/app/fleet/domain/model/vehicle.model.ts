export type VehicleType =
  | 'TRUCK' | 'VAN' | 'CAR' | 'MOTORCYCLE';

export type VehicleStatus =
  | 'IN_SERVICE' | 'OUT_OF_SERVICE' | 'MAINTENANCE' | 'RETIRED';

export interface Vehicle {
  id?: number;
  plate: string;
  type: VehicleType | string;       // canonical: UPPER_CASE
  capabilities: string[];           // canonical: UPPER_CASE
  status: VehicleStatus | string;   // canonical: UPPER_CASE
  odometerKm: number;
  deviceImeis: string[];
}

export const defaultVehicle: Vehicle = {
  plate: '',
  type: 'TRUCK',
  capabilities: [],
  status: 'IN_SERVICE',
  odometerKm: 0,
  deviceImeis: []
};
