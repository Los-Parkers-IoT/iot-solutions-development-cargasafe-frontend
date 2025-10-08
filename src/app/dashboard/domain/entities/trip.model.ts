import { Alert } from './alert.model';
import { TripStatus } from './trip-status.enum';

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