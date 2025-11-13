import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Trip } from '../../../domain/model/trip.entity';
import { Alert } from '../../../../alerts/domain/models/alert.model';
import { TripsStore } from '../../../application/trips.store';

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
  private route = inject(ActivatedRoute);
  private store = inject(TripsStore);

  tripState = computed(() => this.store.tripState);
  trip = computed(() => this.tripState().data() as Trip);

  // ------------------------
  // ⚡ Reactive state (signals)
  // ------------------------
  tripId = 0;
  totalDistance = signal(0);
  totalDuration = signal(0);
  alerts = signal<Alert[]>([]);

  // ------------------------
  // 📋 Table
  // ------------------------
  displayedColumns = [
    'id',
    'sequenceOrder',
    'clientEmail',
    'address',
    'temperatureThreshold',
    'humidityThreshold',
    'arrivalAt',
    'status',
    'actions',
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
    this.store.loadTripById(this.tripId);
  }

  getIncidentsNumberByOrderId(orderId: number): number {
    return this.alerts().filter((alert) => alert.deliveryOrderId === orderId).length;
  }

  markOrderAsDelivered(orderId: number) {
    console.log('Marking order as delivered:', orderId);
    this.store.markOrderAsDelivered(orderId);
  }
}
