import { VehicleType } from './vehicle-type.vo';
import { VehicleStatus } from './vehicle-status.vo';

export interface Vehicle {
  id?: number;
  plate: string;
  type: VehicleType;          // ahora VO
  capabilities: string[];     // puede seguir siendo string[]
  status: VehicleStatus;      // ahora VO
  odometerKm: number;
  deviceImeis: string[];
}

export const defaultVehicle: Vehicle = {
  plate: '',
  type: VehicleType.TRUCK,
  capabilities: [],
  status: VehicleStatus.IN_SERVICE,
  odometerKm: 0,
  deviceImeis: [],
};
