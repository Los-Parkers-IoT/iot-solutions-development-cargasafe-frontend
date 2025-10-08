export type VehicleType = 'Truck' | 'Van' | 'Trailer';
export type VehicleStatus = 'Available' | 'Reserved' | 'In Service' | 'In Maintenance' | 'Out of Service';

export interface Vehicle {
  id?: number;
  plate: string;
  type: VehicleType;
  capabilities: string[];
  status: VehicleStatus;
  odometerKm: number;
  deviceImei?: string | null;
}

export const defaultVehicle: Vehicle = {
  plate: '',
  type: 'Truck',
  capabilities: [],
  status: 'Available',
  odometerKm: 0,
  deviceImei: null
};
