import { Alert } from './alert.entity';

export interface IncidentsByMonthData {
  month: string;
  year: number;
  temperatureIncidents: number;
  movementIncidents: number;
  totalIncidents: number;
  incidents: Alert[];
}


