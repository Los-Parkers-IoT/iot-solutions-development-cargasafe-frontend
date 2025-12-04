export interface IncidentStatsDto {
  month: string;
  year: number;
  totalIncidents: number;
  temperatureIncidents: number;
  movementIncidents: number;
  humidityIncidents: number;
  criticalIncidents: number;
  resolvedIncidents: number;
  averageResolutionTime: number;
}

export interface MonthlyTrendDto {
  month: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
}
