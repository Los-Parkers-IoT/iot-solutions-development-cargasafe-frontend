import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Trip } from '../domain/model/trip.entity';
import { Alert } from '../domain/model/alert.entity';
import { IncidentsByMonthData } from '../domain/model/incidents-by-month.entity';
import { TripAssembler } from './trip-assembler';
import { AlertAssembler } from './alert-assembler';
import { IncidentAssembler } from './incident-assembler';
import { AnalyticsTripResource } from './analytics-trips-response';
import { AnalyticsAlertResource } from './analytics-alerts-response';
import { AnalyticsIncidentsByMonthResource } from './analytics-incidents-response';

@Injectable({ providedIn: 'root' })
export class AnalyticsApi {
  private baseUrl = environment.baseUrl;
  private analyticsEndpoint = '/analytics';
  private http = inject(HttpClient);

  getTrips(): Observable<Trip[]> {
    return this.http
      .get<AnalyticsTripResource[]>(`${this.baseUrl}${this.analyticsEndpoint}/trips`)
      .pipe(
        map((resources) => resources.map((resource) => TripAssembler.toEntityFromResource(resource)))
      );
  }

  getTripById(id: string | number): Observable<Trip> {
    return this.http
      .get<AnalyticsTripResource>(`${this.baseUrl}${this.analyticsEndpoint}/trips/${id}`)
      .pipe(
        map((resource) => TripAssembler.toEntityFromResource(resource))
      );
  }

  getAlerts(): Observable<Alert[]> {
    return this.http
      .get<AnalyticsAlertResource[]>(`${this.baseUrl}${this.analyticsEndpoint}/alerts`)
      .pipe(
        map((resources) => resources.map((resource) => AlertAssembler.toEntityFromResource(resource)))
      );
  }

  getAlertsByTripId(tripId: string | number): Observable<Alert[]> {
    return this.http
      .get<AnalyticsAlertResource[]>(`${this.baseUrl}${this.analyticsEndpoint}/alerts`, {
        params: { tripId: tripId.toString() }
      })
      .pipe(
        map((resources) => resources.map((resource) => AlertAssembler.toEntityFromResource(resource)))
      );
  }

  getIncidentsByMonth(): Observable<IncidentsByMonthData[]> {
    return this.http
      .get<AnalyticsIncidentsByMonthResource[]>(`${this.baseUrl}${this.analyticsEndpoint}/incidents-by-month`)
      .pipe(
        map((resources) => resources.map((resource) => IncidentAssembler.toEntityFromResource(resource)))
      );
  }
}


