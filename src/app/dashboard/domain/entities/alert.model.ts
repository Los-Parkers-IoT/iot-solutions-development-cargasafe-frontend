export interface Alert {
  id: string;
  tripId: string;
  deviceId: string;
  vehiclePlate: string;
  type: AlertType;
  severity: AlertSeverity;
  timestamp: Date;
  location: Location;
  sensorData: SensorData;
  resolved: boolean;
}

export enum AlertType {
  TEMPERATURE = 'TEMPERATURE',
  MOVEMENT = 'MOVEMENT',
  HUMIDITY = 'HUMIDITY',
  LOCATION = 'LOCATION'
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface SensorData {
  temperature?: number;
  humidity?: number;
  movement?: MovementData;
  timestamp: Date;
}

export interface MovementData {
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
  intensity: number;
}