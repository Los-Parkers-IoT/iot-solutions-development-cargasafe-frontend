import { environment } from '../../../../environments/environment';
const base = environment.baseUrl; // ej: http://localhost:8080/api/v1/fleet

export const endpoints = {
  // Devices
  devices: `${base}/fleet/devices`,
  deviceById: (id: number) => `${base}/fleet/devices/${id}`,
  deviceFirmware: (id: number) => `${base}/fleet/devices/${id}/firmware`,
  deviceOnline: (id: number) => `${base}/fleet/devices/${id}/online`,
  devicesByOnline: (online: boolean) => `${base}/fleet/devices/by-online/${online}`,
  deviceByImei: (imei: string) => `${base}/fleet/devices/by-imei/${encodeURIComponent(imei)}`,

  // Vehicles
  vehicles: `${base}/fleet/vehicles`,
  vehicleById: (id: number) => `${base}/fleet/vehicles/${id}`,
  vehicleAssign: (id: number, imei: string) =>
    `${base}/fleet/vehicles/${id}/assign-device/${encodeURIComponent(imei)}`,
  vehicleUnassign: (id: number, imei: string) =>
    `${base}/fleet/vehicles/${id}/unassign-device/${encodeURIComponent(imei)}`,
  vehicleStatus: (id: number) => `${base}/fleet/vehicles/${id}/status`,
  vehiclesByType: (type: string) => `${base}/fleet/vehicles/by-type/${encodeURIComponent(type)}`,
  vehiclesByStatus: (status: string) =>
    `${base}/fleet/vehicles/by-status/${encodeURIComponent(status)}`,
  vehicleByPlate: (plate: string) => `${base}/fleet/vehicles/by-plate/${encodeURIComponent(plate)}`,
};
