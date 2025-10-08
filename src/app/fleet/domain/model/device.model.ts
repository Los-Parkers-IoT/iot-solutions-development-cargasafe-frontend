export type DeviceType = 'Temp + GPS' | 'GPS' | 'Env Sensor';

export interface Device {
  id?: number;
  imei: string;
  type: DeviceType;
  firmware: string;
  online: boolean;
  vehiclePlate?: string | null;
}

export const defaultDevice: Device = {
  imei: '',
  type: 'Temp + GPS',
  firmware: 'v1.0.0',
  online: false,
  vehiclePlate: null
};
