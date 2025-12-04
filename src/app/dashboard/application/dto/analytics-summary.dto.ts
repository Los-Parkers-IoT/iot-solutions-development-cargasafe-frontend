export interface AnalyticsSummaryDto {
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  totalAlerts: number;
  pendingAlerts: number;
  resolvedAlerts: number;
  criticalAlerts: number;
  totalIncidents: number;
  temperatureIncidents: number;
  movementIncidents: number;
  averageTripDistance: number;
  averageTripDuration: number;
}
