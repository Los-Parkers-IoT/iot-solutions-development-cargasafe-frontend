import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TripTotalSummary } from '../../components/trip-total-summary/trip-total-summary';
import { TripTableList } from '../../components/trip-table-list/trip-table-list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-trip-list-page',
  imports: [CommonModule, TripTotalSummary, TripTableList, MatButtonModule, RouterModule],
  templateUrl: './trip-list-page.html',
  styleUrl: './trip-list-page.css',
  standalone: true,
})
export class TripListPage {}
