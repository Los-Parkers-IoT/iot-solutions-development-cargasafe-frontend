export interface VehicleResponse {
  id: number;
  plate: string;
  type: string;
  capabilities: string[] | null;
  status: string;
  odometerKm: number;
  deviceImeis: string[] | null;    // <-- lista
}

export interface CreateVehicleDto {
  plate: string;
  type: string;
  capabilities: string[];
  status: string;
  odometerKm: number;
  deviceImeis: string[];           // enviar [] si vacío
}


export interface UpdateVehicleDto extends CreateVehicleDto {} // id en la URL

export interface UpdateVehicleStatusDto {
  status: string;
}
