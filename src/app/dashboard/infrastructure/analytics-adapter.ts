
export class AnalyticsAdapter {
  
  static adaptTripResponse(backendTrip: any): any {
    console.log('🔄 Adapting trip response:', backendTrip);
    
    const id = backendTrip.tripId ?? backendTrip.id;
    
    if (id == null) {
      console.error('⚠️ Trip response missing both tripId and id:', backendTrip);
    }
    
    const adapted = {
      id: id,
      startDate: backendTrip.startDate,
      endDate: backendTrip.endDate,
      origin: backendTrip.origin,
      destination: backendTrip.destination,
      vehiclePlate: backendTrip.vehiclePlate,
      driverName: backendTrip.driverName,
      cargoType: backendTrip.cargoType,
      status: backendTrip.status,
      distance: backendTrip.distance,
      alerts: backendTrip.alerts || []
    };
    
    console.log('✅ Adapted trip:', adapted);
    return adapted;
  }
  static adaptAlertResponse(backendAlert: any): any {
    return {
      id: backendAlert.alertId || backendAlert.id,
      tripId: backendAlert.tripId?.toString() || '',
      deviceId: backendAlert.deviceId,
      vehiclePlate: backendAlert.vehiclePlate,
      type: backendAlert.type,
      severity: backendAlert.severity,
      timestamp: backendAlert.timestamp,
      location: backendAlert.location,
      sensorData: this.adaptSensorData(backendAlert.sensorData, backendAlert.type),
      resolved: backendAlert.resolved
    };
  }

  private static adaptSensorData(data: Record<string, string> | any, alertType: string): any {
    if (!data) return {};
    
    if (typeof data === 'object' && !this.isRecordOfStrings(data)) {
      return data;
    }

    const adapted: any = {};
    
    if (alertType === 'TEMPERATURE' && data.temperature) {
      adapted.temperature = this.parseNumericValue(data.temperature);
      if (data.timestamp) {
        adapted.timestamp = data.timestamp;
      }
    }
    
    else if (alertType === 'MOVEMENT') {
      if (data.movement) {
        try {
          adapted.movement = typeof data.movement === 'string' 
            ? JSON.parse(data.movement) 
            : data.movement;
        } catch {
          adapted.movement = data.movement;
        }
      }
      if (data.timestamp) {
        adapted.timestamp = data.timestamp;
      }
    }
    
    else if (alertType === 'HUMIDITY' && data.humidity) {
      adapted.humidity = this.parseNumericValue(data.humidity);
      if (data.timestamp) {
        adapted.timestamp = data.timestamp;
      }
    }
    
    else if (alertType === 'DOOR_OPEN') {
      if (data.door) {
        try {
          adapted.door = typeof data.door === 'string' 
            ? JSON.parse(data.door) 
            : data.door;
        } catch {
          adapted.door = data.door;
        }
      }
      if (data.timestamp) {
        adapted.timestamp = data.timestamp;
      }
    }
    
    else {
      for (const [key, value] of Object.entries(data)) {
        adapted[key] = this.parseNumericValue(value);
      }
    }
    
    return adapted;
  }


  static adaptIncidentResponse(backendIncident: any): any {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    let monthName = backendIncident.month;
    
    if (typeof monthName === 'string') {
      monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    }
    else if (typeof monthName === 'number') {
      monthName = months[monthName - 1];
    }
    
    const adapted = {
      id: backendIncident.id || Math.random(),
      month: monthName,
      year: backendIncident.year,
      temperatureIncidents: backendIncident.temperatureIncidents !== undefined
        ? backendIncident.temperatureIncidents
        : this.countIncidentsByType(backendIncident.incidents, 'TEMPERATURE'),
      movementIncidents: backendIncident.movementIncidents !== undefined
        ? backendIncident.movementIncidents
        : this.countIncidentsByType(backendIncident.incidents, 'MOVEMENT'),
      totalIncidents: backendIncident.totalIncidents,
      incidents: this.adaptIncidents(backendIncident.incidents)
    };
    
    console.log('📊 Adapted incident response:', adapted);
    return adapted;
  }


  private static adaptIncidents(incidents: any[]): any[] {
    if (!incidents || !Array.isArray(incidents)) return [];
    
    return incidents.map(inc => ({
      timestamp: inc.timestamp,
      vehiclePlate: inc.vehiclePlate,
      deviceId: inc.deviceId,
      type: inc.type || this.inferTypeFromDescription(inc.description)
    }));
  }


  private static countIncidentsByType(incidents: any[], type: string): number {
    if (!incidents || !Array.isArray(incidents)) return 0;
    
    return incidents.filter(i => {
      if (i.type === type) return true;
      if (i.description) {
        const desc = i.description.toLowerCase();
        return desc.includes(type.toLowerCase());
      }
      return false;
    }).length;
  }

  private static inferTypeFromDescription(description: string): string {
    if (!description) return 'UNKNOWN';
    
    const desc = description.toLowerCase();
    if (desc.includes('temperatura') || desc.includes('temperature')) {
      return 'TEMPERATURE';
    }
    if (desc.includes('movimiento') || desc.includes('movement') || desc.includes('vibra')) {
      return 'MOVEMENT';
    }
    if (desc.includes('humedad') || desc.includes('humidity')) {
      return 'HUMIDITY';
    }
    if (desc.includes('puerta') || desc.includes('door')) {
      return 'DOOR_OPEN';
    }
    
    return 'UNKNOWN';
  }

  private static isRecordOfStrings(obj: any): boolean {
    if (typeof obj !== 'object' || obj === null) return false;
    return Object.values(obj).every(v => typeof v === 'string');
  }

  private static parseNumericValue(value: any): any {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed;
    }
    return value;
  }
}
