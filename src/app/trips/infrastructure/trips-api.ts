import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { Trip } from '../domain/model/trip.entity';
import { HttpClient } from '@angular/common/http';
import { TripAssembler } from './trip-assembler';
import { TripResource } from './trip-response';

@Injectable({ providedIn: 'root' })
export class TripsApi {
  private baseUrl = environment.baseUrl;
  private tripsEndpoint = environment.tripsEndpointPath;
  private http = inject(HttpClient);

  getTrips(): Observable<Trip[]> {
    return this.http
      .get<TripResource[]>(`${this.baseUrl}${this.tripsEndpoint}`)
      .pipe(map((response) => response.map(TripAssembler.toEntityFromResource)));
  }
}
