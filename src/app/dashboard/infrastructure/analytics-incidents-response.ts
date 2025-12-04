export interface AnalyticsIncidentsByMonthResource {
  id: number | null;
  month: string | number;
  monthName?: string;
  year: number;
  temperatureIncidents: number;
  movementIncidents: number;
  totalIncidents: number;
  incidents: IncidentResource[];
}

export interface IncidentResource {
  timestamp: string;
  vehiclePlate: string;
  deviceId: string;
  type: string;
  description?: string;
}


