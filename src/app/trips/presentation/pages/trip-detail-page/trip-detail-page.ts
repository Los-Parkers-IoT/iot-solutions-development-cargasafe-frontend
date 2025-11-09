import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

import { TripsApi } from '../../../infrastructure/trips-api';
import { TripParametersApi } from '../../../infrastructure/trip-parameter-api';
import { DeliveryOrdersApi } from '../../../infrastructure/delivery-order-api';
import { Trip } from '../../../domain/model/trip.entity';
import { TripParameter } from '../../../domain/model/trip-parameter.entity';
import { DeliveryOrder } from '../../../domain/model/delivery-order.entity';
import { AlertsService } from '../../../../alerts/infrastructure/alerts-api';
import { Alert } from '../../../../alerts/domain/models/alert.model';
import { OriginPointApi as OriginPointsApi } from '../../../infrastructure/origin-point-api';
import { OriginPoint } from '../../../domain/model/origin-point.entity';

@Component({
  selector: 'app-trip-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GoogleMapsModule,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './trip-detail-page.html',
  styleUrls: ['./trip-detail-page.css'],
})
export class TripDetailPage implements OnInit {
  // ------------------------
  // 🗺️ Google Maps
  // ------------------------
  center: google.maps.LatLngLiteral = { lat: -12.072847, lng: -77.080581 };
  zoom = 12;
  markers: google.maps.LatLngLiteral[] = [];

  // ------------------------
  // 🧩 Dependencies
  // ------------------------
  private tripsApi = inject(TripsApi);
  private tripParametersApi = inject(TripParametersApi);
  private deliveryOrdersApi = inject(DeliveryOrdersApi);
  private originPointsApi = inject(OriginPointsApi);
  private route = inject(ActivatedRoute);
  private alertsApi = inject(AlertsService);

  // ------------------------
  // ⚡ Reactive state (signals)
  // ------------------------
  tripId = 0;
  loading = signal(false);
  error = signal<string | null>(null);
  trip = signal<Trip | null>(null);
  totalDistance = signal(0);
  totalDuration = signal(0);
  tripParameters = signal<TripParameter | null>(null);
  deliveryOrders = signal<DeliveryOrder[]>([]);
  originPoint = signal<OriginPoint | null>(null);
  alerts = signal<Alert[]>([]);

  // ------------------------
  // 📋 Table
  // ------------------------
  displayedColumns = [
    'id',
    'sequenceOrder',
    'clientEmail',
    'address',
    'arrivalAt',
    'realArrivalAt',
    'deliveryOrderStatusId',
    'incidents',
  ];

  polylinePath: google.maps.LatLngLiteral[] = [];
  polylineOptions: google.maps.PolylineOptions = {
    strokeColor: '#4285F4',
    strokeOpacity: 1.0,
    strokeWeight: 3,
  };

  // ------------------------
  // 🚀 Lifecycle
  // ------------------------
  ngOnInit(): void {
    this.tripId = Number(this.route.snapshot.params['id']);
    this.load();
  }

  // ------------------------
  // 🔁 Load data
  // ------------------------
  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.trip.set(null);
    this.deliveryOrders.set([]);

    forkJoin({
      trip: this.tripsApi.getTripById(this.tripId),
      params: this.tripParametersApi.getTripParametersByTripId(this.tripId),
      orders: this.deliveryOrdersApi.getDeliveryOrdersByTripId(this.tripId),
      alerts: this.alertsApi.getAlerts(),
      origin: this.originPointsApi.getOriginPointByTripId(this.tripId),
    }).subscribe({
      next: ({ trip, params, orders, alerts, origin }) => {
        if (!trip) {
          this.error.set('Trip not found.');
          this.loading.set(false);
          return;
        }

        if (!origin) {
          this.error.set('Origin point not found for this trip.');
          this.loading.set(false);
          return;
        }

        // 🧠 Assign data
        this.trip.set(trip);
        this.tripParameters.set(params?.[0] ?? null);
        this.deliveryOrders.set(orders);
        this.alerts.set(
          alerts.filter(
            (alert) =>
              alert.deliveryOrderId && orders.some((o) => o.id === Number(alert.deliveryOrderId))
          )
        );

        // Optionally: center map to first delivery point
        if (orders?.length > 0 && orders[0].latitude && orders[0].longitude) {
          this.center = { lat: orders[0].latitude, lng: orders[0].longitude };

          this.markers = orders.map((o) => ({
            lat: o.latitude,
            lng: o.longitude,
          }));

          this.polylinePath = this.markers;
        }

        // Set origin point marker
        this.markers.unshift({ lat: origin.latitude, lng: origin.longitude });
        this.polylinePath.unshift({ lat: origin.latitude, lng: origin.longitude });
        this.center = { lat: origin.latitude, lng: origin.longitude };
        this.originPoint.set(origin);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('❌ Error loading trip data', err);
        this.error.set(err?.message ?? 'An unexpected error occurred while loading the trip.');
        this.loading.set(false);
      },
    });
  }

  // ------------------------
  // 🔁 Retry button
  // ------------------------
  retry(): void {
    this.load();
  }

  getIncidentsNumberByOrderId(orderId: number): number {
    return this.alerts().filter((alert) => alert.deliveryOrderId === orderId).length;
  }
}
