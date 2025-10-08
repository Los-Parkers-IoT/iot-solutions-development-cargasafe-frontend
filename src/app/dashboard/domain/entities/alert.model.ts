import { AlertType } from './alert-type.enum';
import { AlertSeverity } from './alert-severity.enum';
import { Location } from './location.model';
import { SensorData } from './sensor-data.model';

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