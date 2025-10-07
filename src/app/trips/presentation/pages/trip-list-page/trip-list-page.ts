import { Component, inject, OnInit } from '@angular/core';
import { TripsStore } from '../../../application/trips.store';

@Component({
  selector: 'app-trip-list-page',
  imports: [],
  templateUrl: './trip-list-page.html',
  styleUrl: './trip-list-page.css',
})
export class TripListPage implements OnInit {
  readonly store = inject(TripsStore);

  ngOnInit(): void {
    this.store.loadTrips();
  }
}
