import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-trip-detail-page',
  imports: [MatTableModule, MatPaginatorModule, MatIconModule, MatSortModule, GoogleMapsModule],
  templateUrl: './trip-detail-page.html',
  styleUrl: './trip-detail-page.css',
})
export class TripDetailPage {
  center: google.maps.LatLngLiteral = { lat: -12.072847, lng: -77.080581 };
  zoom = 12;
  markers = [];

  trip = {
    id: '00000001',
    status: 'In course',
    createdAt: '10/06/2025, 8:30 AM',
    departureAt: '10/06/2025, 10:30 AM',
    driver: 'Juan Pablo',
    coDriver: 'Not assigned',
    shipping: {
      distance: '3.2 km',
      duration: '03:24',
    },
    actual: {
      distance: '3.0 km',
      duration: '04:12',
    },
  };

  deliveryOrders = [
    {
      id: 8,
      sequence: 1,
      client: 'Nicole Arevalo',
      address: 'Av. Javier Prado 1000',
      arrival: '8:30 AM',
      realArrival: '8:30 AM',
      status: 'Completed',
      incidents: 2,
    },
    {
      id: 9,
      sequence: 2,
      client: 'mgo@mail.com',
      address: 'Av. Javier Prado 1200',
      arrival: '8:30 AM',
      realArrival: '-',
      status: 'In course',
      incidents: 1,
    },
    {
      id: 10,
      sequence: 3,
      client: 'Nicole Arevalo',
      address: 'Av. Javier Prado 1400',
      arrival: '8:30 AM',
      realArrival: '-',
      status: 'Cancelled',
      incidents: 0,
    },
    {
      id: 11,
      sequence: 4,
      client: 'Nicole Arevalo',
      address: 'Av. Javier Prado 1600',
      arrival: '8:30 AM',
      realArrival: '-',
      status: 'In course',
      incidents: 0,
    },
    {
      id: 12,
      sequence: 5,
      client: 'Nicole Arevalo',
      address: 'Av. Javier Prado 1800',
      arrival: '8:30 AM',
      realArrival: '-',
      status: 'In course',
      incidents: 0,
    },
  ];

  displayedColumns = [
    'id',
    'sequence',
    'client',
    'address',
    'arrival',
    'realArrival',
    'status',
    'incidents',
  ];
}
