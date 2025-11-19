// --- Respuestas (backend -> frontend)
export interface DeviceDto {
  id: number;                 // Long -> number
  imei: string;
  firmware: string;
  online: boolean;
  vehiclePlate?: string | null;
}

// --- Requests (frontend -> backend)
// create: NO id
export interface CreateDeviceDto {
  imei: string;
  firmware: string;
  online: boolean;
  vehiclePlate?: string | null;
}

// update (PUT /devices/{id}) -> id va en la URL; body sin id
export interface UpdateDeviceDto {
  imei: string;
  firmware: string;
  online: boolean;
  vehiclePlate?: string | null;
}

// patches específicos
export interface UpdateDeviceFirmwareDto { firmware: string; }
export interface UpdateDeviceOnlineDto   { online: boolean;   }
