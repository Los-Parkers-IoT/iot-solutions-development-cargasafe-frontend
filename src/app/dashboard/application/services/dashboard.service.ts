import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Trip, IncidentsByMonthData, Alert } from '../../domain/entities';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<any[]>(`${this.API_URL}/trips`).pipe(
      map(trips => trips.map(trip => Trip.fromJson(trip)))
    );
  }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<any[]>(`${this.API_URL}/alerts`).pipe(
      map(alerts => alerts.map(alert => Alert.fromJson(alert)))
    );
  }

  getIncidentsByMonth(): Observable<IncidentsByMonthData[]> {
    return this.http.get<IncidentsByMonthData[]>(`${this.API_URL}/incidentsByMonth`);
  }

  getTripById(id: string): Observable<Trip> {
    return this.http.get<any>(`${this.API_URL}/trips/${id}`).pipe(
      map(trip => Trip.fromJson(trip))
    );
  }

  getAlertsByTripId(tripId: string): Observable<Alert[]> {
    return this.http.get<any[]>(`${this.API_URL}/alerts?tripId=${tripId}`).pipe(
      map(alerts => alerts.map(alert => Alert.fromJson(alert)))
    );
  }
}