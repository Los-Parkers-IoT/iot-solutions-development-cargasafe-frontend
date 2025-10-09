import { Component, effect, inject, OnInit } from '@angular/core';
import { TripsStore } from '../../../application/trips.store';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Trip } from '../../../domain/model/trip.entity';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trip-list-page',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './trip-list-page.html',
  styleUrl: './trip-list-page.css',
})
export class TripListPage implements OnInit {
  readonly store = inject(TripsStore);

  displayedColumns: string[] = ['id', 'driver', 'codriver', 'createdAt', 'departure', 'actions'];

  dataSource = new MatTableDataSource<Trip>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.store.trips();
    });
  }

  ngOnInit(): void {
    this.store.loadTrips();
  }
}
