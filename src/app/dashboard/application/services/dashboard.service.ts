import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trip, IncidentsByMonthData, Alert } from '../../domain/entities';
import { environment } from '../../../../environments/environment';
import { AnalyticsAdapter } from '../../infrastructure/analytics-adapter';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly API_URL = `${environment.baseUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    console.log('🔍 Fetching trips from:', `${this.API_URL}/trips`);
    return this.http
      .get<any[]>(`${this.API_URL}/trips`)
      .pipe(
        map((trips) => {
          console.log('📦 Raw backend response:', trips);
          const adapted = trips.map((trip) => {
            const adaptedTrip = AnalyticsAdapter.adaptTripResponse(trip);
            const tripEntity = Trip.fromJson(adaptedTrip);
            console.log('🚚 Trip entity created:', { id: tripEntity.id, plate: tripEntity.vehiclePlate });
            return tripEntity;
          });
          console.log('✅ Total trips processed:', adapted.length);
          return adapted;
        })
      );
  }

  getAlerts(): Observable<Alert[]> {
    return this.http
      .get<any[]>(`${this.API_URL}/alerts`)
      .pipe(
        map((alerts) => 
          alerts.map((alert) => Alert.fromJson(AnalyticsAdapter.adaptAlertResponse(alert)))
        )
      );
  }

  getIncidentsByMonth(): Observable<IncidentsByMonthData[]> {
    console.log('🔍 Fetching incidents from:', `${this.API_URL}/incidents-by-month`);
    return this.http
      .get<any[]>(`${this.API_URL}/incidents-by-month`)
      .pipe(
        map((incidents) => {
          console.log('📦 Raw incidents response:', incidents);
          const adapted = incidents.map((incident) => AnalyticsAdapter.adaptIncidentResponse(incident));
          console.log('✅ Adapted incidents:', adapted);
          return adapted;
        })
      );
  }

  getTripById(id: string): Observable<Trip> {
    return this.http
      .get<any>(`${this.API_URL}/trips/${id}`)
      .pipe(
        map((trip) => Trip.fromJson(AnalyticsAdapter.adaptTripResponse(trip)))
      );
  }

  getAlertsByTripId(tripId: string): Observable<Alert[]> {
    return this.http
      .get<any[]>(`${this.API_URL}/alerts`, { params: { tripId } })
      .pipe(
        map((alerts) => 
          alerts.map((alert) => Alert.fromJson(AnalyticsAdapter.adaptAlertResponse(alert)))
        )
      );
  }
}
