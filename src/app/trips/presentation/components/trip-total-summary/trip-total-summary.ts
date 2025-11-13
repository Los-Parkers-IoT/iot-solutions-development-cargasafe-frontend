import { Component, computed, inject, Input, OnInit } from '@angular/core';
import { TripsStore } from '../../../application/trips.store';

@Component({
  selector: 'app-trip-total-summary',
  imports: [],
  templateUrl: './trip-total-summary.html',
  styleUrl: './trip-total-summary.css',
})
export class TripTotalSummary implements OnInit {
  readonly store = inject(TripsStore);
  readonly summaryState = computed(() => this.store.totalTripsSummary);

  ngOnInit(): void {
    this.store.loadTotalTripsSummary();
  }
}
