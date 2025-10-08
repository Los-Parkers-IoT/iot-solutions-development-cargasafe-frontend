import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip, IncidentsByMonthData, Alert } from '../../domain/entities';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.API_URL}/trips`);
  }

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.API_URL}/alerts`);
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