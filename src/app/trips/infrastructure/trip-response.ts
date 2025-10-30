export interface TripResource {
  id: number;
  statusId: number;
  driverId: number;
  coDriverId: number | null;
  vehicleId: number;
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
  departureAt: string | null;
  merchantId: number;
  originPointId: number;
  polyline_encrypted: string;
  totalDistanceKm: number;
  totalDurationMin: number;
}

export interface TripsResponse {
  trips: TripResource[];
}
