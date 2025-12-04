import { MovementData } from './movement-data.entity';

export interface SensorData {
  temperature?: number;
  humidity?: number;
  movement?: MovementData;
  timestamp: Date;
}


