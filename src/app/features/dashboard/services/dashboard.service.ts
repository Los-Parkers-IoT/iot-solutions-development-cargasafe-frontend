import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip, Alert, IncidentsByMonthData } from '../models/trip.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly API_URL = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.API_URL}/analytics-trips`);
  }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.API_URL}/analytics-alerts`);
  }

  getIncidentsByMonth(): Observable<IncidentsByMonthData[]> {
    return this.http.get<IncidentsByMonthData[]>(`${this.API_URL}/incidentsByMonth`);
  }

  getTripById(id: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.API_URL}/trips/${id}`);
  }

  getAlertsByTripId(tripId: string): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.API_URL}/alerts?tripId=${tripId}`);
  }
}
