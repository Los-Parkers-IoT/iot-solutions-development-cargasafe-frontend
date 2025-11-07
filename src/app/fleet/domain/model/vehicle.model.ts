export type VehicleType = 'Truck' | 'Van' | 'Trailer';
export type VehicleStatus =
  | 'Available' | 'Reserved' | 'In Service' | 'In Maintenance' | 'Out of Service';

export interface Vehicle {
  id?: number;                  // Long en backend
  plate: string;
  type: VehicleType | string;   // backend envía string; mantenemos union flexible
  capabilities: string[];
  status: VehicleStatus | string;
  odometerKm: number;
  deviceImeis: string[];        // <-- ahora es lista
}

export const defaultVehicle: Vehicle = {
  plate: '',
  type: 'Truck',
  capabilities: [],
  status: 'Available',
  odometerKm: 0,
  deviceImeis: []
};
