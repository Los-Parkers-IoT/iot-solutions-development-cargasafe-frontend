import { environment } from '../../../../environments/environment';
const base = environment.apiBaseUrl; // ej: http://localhost:8080/api/v1/fleet

export const endpoints = {
  // Devices
  devices:            `${base}/devices`,
  deviceById:         (id: number) => `${base}/devices/${id}`,
  deviceFirmware:     (id: number) => `${base}/devices/${id}/firmware`,
  deviceOnline:       (id: number) => `${base}/devices/${id}/online`,
  devicesByOnline:    (online: boolean) => `${base}/devices/by-online/${online}`,
  deviceByImei:       (imei: string) => `${base}/devices/by-imei/${encodeURIComponent(imei)}`,

  // Vehicles
  vehicles:           `${base}/vehicles`,
  vehicleById:        (id: number) => `${base}/vehicles/${id}`,
  vehicleAssign:      (id: number, imei: string) => `${base}/vehicles/${id}/assign-device/${encodeURIComponent(imei)}`,
  vehicleUnassign:    (imei: string) => `${base}/vehicles/unassign-device/${encodeURIComponent(imei)}`,
  vehicleStatus:      (id: number) => `${base}/vehicles/${id}/status`,
  vehiclesByType:     (type: string) => `${base}/vehicles/by-type/${encodeURIComponent(type)}`,
  vehiclesByStatus:   (status: string) => `${base}/vehicles/by-status/${encodeURIComponent(status)}`,
  vehicleByPlate:     (plate: string) => `${base}/vehicles/by-plate/${encodeURIComponent(plate)}`
};
