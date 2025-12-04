import { AnalyticsAlertResource, type LocationResource, SensorDataResource } from './analytics-alerts-response';
import { Alert } from '../domain/model/alert.entity';
import { AlertType } from '../domain/model/alert-type.vo';
import { AlertSeverity } from '../domain/model/alert-severity.vo';
import type { Location } from '../domain/model/location.entity';
import type { SensorData } from '../domain/model/sensor-data.entity';
import type { MovementData } from '../domain/model/movement-data.entity';

export class AlertAssembler {
  static toEntityFromResource(resource: AnalyticsAlertResource): Alert {
    const id = resource.alertId ?? resource.id;
    const tripId = resource.tripId?.toString() || '';
    
    const type = this.parseAlertType(resource.type);
    const severity = this.parseAlertSeverity(resource.severity);
    
    const timestamp = new Date(resource.timestamp);
    
    const location = resource.location 
      ? this.toLocationFromResource(resource.location)
      : { latitude: 0, longitude: 0 };
    
    const sensorData = this.toSensorDataFromResource(resource.sensorData, resource.type);

    return new Alert(
      id,
      tripId,
      resource.deviceId,
      resource.vehiclePlate,
      type,
      severity,
      timestamp,
      location,
      sensorData,
      resource.resolved
    );
  }

  private static toLocationFromResource(resource: LocationResource): Location {
    return {
      latitude: resource.latitude,
      longitude: resource.longitude,
      address: resource.address
    };
  }

  private static toSensorDataFromResource(
    data: Record<string, string> | SensorDataResource,
    alertType: string
  ): SensorData {
    if (!data) {
      return { timestamp: new Date() };
    }

    if (this.isRecordOfStrings(data)) {
      return this.adaptSensorDataFromStrings(data as Record<string, string>, alertType);
    }

    const typedData = data as SensorDataResource;
    
    const movement: MovementData | undefined = typedData.movement 
      ? {
          acceleration: {
            x: typedData.movement.x,
            y: typedData.movement.y,
            z: typedData.movement.z
          },
          intensity: typedData.movement.intensity || 0
        }
      : undefined;

    return {
      temperature: typedData.temperature,
      humidity: typedData.humidity,
      movement,
      timestamp: typedData.timestamp ? new Date(typedData.timestamp) : new Date()
    };
  }

  private static adaptSensorDataFromStrings(
    data: Record<string, string>,
    alertType: string
  ): SensorData {
    const sensorData: SensorData = { timestamp: new Date() };

    if (alertType === 'TEMPERATURE' && data['temperature']) {
      sensorData.temperature = parseFloat(data['temperature']);
      if (data['timestamp']) {
        sensorData.timestamp = new Date(data['timestamp']);
      }
    } else if (alertType === 'HUMIDITY' && data['humidity']) {
      sensorData.humidity = parseFloat(data['humidity']);
      if (data['timestamp']) {
        sensorData.timestamp = new Date(data['timestamp']);
      }
    } else if (alertType === 'MOVEMENT' && data['movement']) {
      try {
        const movementData = typeof data['movement'] === 'string'
          ? JSON.parse(data['movement'])
          : data['movement'];
        sensorData.movement = {
          acceleration: {
            x: movementData.x,
            y: movementData.y,
            z: movementData.z
          },
          intensity: movementData.intensity || 0
        };
        if (data['timestamp']) {
          sensorData.timestamp = new Date(data['timestamp']);
        }
      } catch {
        // Keep default
      }
    }

    return sensorData;
  }

  private static isRecordOfStrings(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false;
    return Object.values(obj).every(v => typeof v === 'string');
  }

  private static parseAlertType(type: string): AlertType {
    switch (type) {
      case 'TEMPERATURE':
        return AlertType.TEMPERATURE;
      case 'MOVEMENT':
        return AlertType.MOVEMENT;
      case 'HUMIDITY':
        return AlertType.HUMIDITY;
      case 'DOOR_OPEN':
      case 'LOCATION':
        return AlertType.LOCATION;
      default:
        return AlertType.TEMPERATURE;
    }
  }

  private static parseAlertSeverity(severity: string): AlertSeverity {
    switch (severity) {
      case 'LOW':
        return AlertSeverity.LOW;
      case 'MEDIUM':
        return AlertSeverity.MEDIUM;
      case 'HIGH':
        return AlertSeverity.HIGH;
      case 'CRITICAL':
        return AlertSeverity.CRITICAL;
      default:
        return AlertSeverity.LOW;
    }
  }
}


