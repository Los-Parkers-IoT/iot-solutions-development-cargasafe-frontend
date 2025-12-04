import { AnalyticsIncidentsByMonthResource, IncidentResource } from './analytics-incidents-response';
import { IncidentsByMonthData } from '../domain/model/incidents-by-month.entity';

export class IncidentAssembler {
  static toEntityFromResource(resource: AnalyticsIncidentsByMonthResource): IncidentsByMonthData {
    const monthName = this.normalizeMonthName(resource.month, resource.monthName);
    
    const temperatureIncidents = resource.temperatureIncidents !== undefined
      ? resource.temperatureIncidents
      : this.countIncidentsByType(resource.incidents, 'TEMPERATURE');
    
    const movementIncidents = resource.movementIncidents !== undefined
      ? resource.movementIncidents
      : this.countIncidentsByType(resource.incidents, 'MOVEMENT');

    return {
      month: monthName,
      year: resource.year,
      temperatureIncidents,
      movementIncidents,
      totalIncidents: resource.totalIncidents,
      incidents: []
    };
  }

  private static normalizeMonthName(month: string | number, monthName?: string): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (typeof month === 'string') {
      return month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    }
    
    if (typeof month === 'number') {
      return months[month - 1];
    }
    
    if (monthName) {
      return monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    }

    return 'Unknown';
  }

  private static countIncidentsByType(incidents: IncidentResource[], type: string): number {
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

  private static inferTypeFromDescription(description?: string): string {
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
}


