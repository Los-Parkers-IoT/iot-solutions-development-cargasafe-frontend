export interface AnalyticsAlertResource {
  id: number;
  alertId?: number;
  tripId: string | number;
  deviceId: string;
  vehiclePlate: string;
  type: 'TEMPERATURE' | 'MOVEMENT' | 'HUMIDITY' | 'DOOR_OPEN';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
  location: LocationResource | null;
  sensorData: Record<string, string> | SensorDataResource;
  resolved: boolean;
}

export interface LocationResource {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface SensorDataResource {
  temperature?: number;
  humidity?: number;
  movement?: MovementDataResource;
  door?: DoorDataResource;
  timestamp?: string;
}

export interface MovementDataResource {
  x: number;
  y: number;
  z: number;
  intensity?: number;
}

export interface DoorDataResource {
  opened: boolean;
  duration?: number;
}


