import { Alert } from './alert.model';

export interface Trip {
  id: string;
  startDate: Date;
  endDate: Date;
  origin: string;
  destination: string;
  vehiclePlate: string;
  driverName: string;
  cargoType: string;
  status: TripStatus;
  distance: number; // en km
  alerts: Alert[];
}

export enum TripStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DELAYED = 'DELAYED'
}

export interface IncidentsByMonthData {
  month: string;
  year: number;
  temperatureIncidents: number;
  movementIncidents: number;
  totalIncidents: number;
  incidents: Alert[];
}