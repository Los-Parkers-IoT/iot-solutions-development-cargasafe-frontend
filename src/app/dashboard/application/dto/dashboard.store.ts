import { computed, inject, Injectable } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { Trip } from '../../domain/model/trip.entity';
import { Alert } from '../../domain/model/alert.entity';
import { IncidentsByMonthData } from '../../domain/model/incidents-by-month.entity';
import { AnalyticsApi } from '../../infrastructure/analytics-api';
import { createAsyncState } from '../../../shared/helpers/async-state';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private analyticsApi = inject(AnalyticsApi);
  
  readonly tripsState = createAsyncState<Trip[]>([]);
  readonly alertsState = createAsyncState<Alert[]>([]);
  readonly incidentsState = createAsyncState<IncidentsByMonthData[]>([]);
  readonly selectedTripState = createAsyncState<Trip | null>(null);

  readonly activeTripsCount = computed(() => {
    const trips = this.tripsState.data();
    return trips.filter(trip => 
      trip.status === 'IN_PROGRESS' || trip.status === 'COMPLETED'
    ).length;
  });

  readonly totalAlertsCount = computed(() => {
    return this.alertsState.data().length;
  });

  readonly pendingAlertsCount = computed(() => {
    return this.alertsState.data().filter(alert => !alert.resolved).length;
  });

  loadTrips() {
    this.tripsState.setLoading(true);
    this.analyticsApi
      .getTrips()
      .pipe(
        tap({
          next: (trips) => {
            this.tripsState.setData(trips);
            console.log('DashboardStore: loaded trips', trips);
          },
          error: (error) => {
            console.error('DashboardStore: failed to load trips', error);
            this.tripsState.setError('Failed to load trips');
          }
        }),
        finalize(() => this.tripsState.setLoading(false))
      )
      .subscribe();
  }

  loadAlerts() {
    this.alertsState.setLoading(true);
    this.analyticsApi
      .getAlerts()
      .pipe(
        tap({
          next: (alerts) => {
            this.alertsState.setData(alerts);
            console.log('DashboardStore: loaded alerts', alerts);
          },
          error: (error) => {
            console.error('DashboardStore: failed to load alerts', error);
            this.alertsState.setError('Failed to load alerts');
          }
        }),
        finalize(() => this.alertsState.setLoading(false))
      )
      .subscribe();
  }

  loadIncidentsByMonth() {
    this.incidentsState.setLoading(true);
    this.analyticsApi
      .getIncidentsByMonth()
      .pipe(
        tap({
          next: (incidents) => {
            this.incidentsState.setData(incidents);
            console.log('DashboardStore: loaded incidents', incidents);
          },
          error: (error) => {
            console.error('DashboardStore: failed to load incidents', error);
            this.incidentsState.setError('Failed to load incidents');
          }
        }),
        finalize(() => this.incidentsState.setLoading(false))
      )
      .subscribe();
  }

  loadTripById(id: string | number) {
    this.selectedTripState.setLoading(true);
    this.analyticsApi
      .getTripById(id)
      .pipe(
        tap({
          next: (trip) => {
            this.selectedTripState.setData(trip);
            console.log('DashboardStore: loaded trip', trip);
          },
          error: (error) => {
            console.error('DashboardStore: failed to load trip', error);
            this.selectedTripState.setError('Failed to load trip');
          }
        }),
        finalize(() => this.selectedTripState.setLoading(false))
      )
      .subscribe();
  }

  loadAlertsByTripId(tripId: string | number) {
    this.alertsState.setLoading(true);
    this.analyticsApi
      .getAlertsByTripId(tripId)
      .pipe(
        tap({
          next: (alerts) => {
            this.alertsState.setData(alerts);
            console.log('DashboardStore: loaded alerts for trip', alerts);
          },
          error: (error) => {
            console.error('DashboardStore: failed to load alerts for trip', error);
            this.alertsState.setError('Failed to load alerts');
          }
        }),
        finalize(() => this.alertsState.setLoading(false))
      )
      .subscribe();
  }

  loadAllDashboardData() {
    this.loadTrips();
    this.loadAlerts();
    this.loadIncidentsByMonth();
  }

  clearSelectedTrip() {
    this.selectedTripState.setData(null);
  }
}
