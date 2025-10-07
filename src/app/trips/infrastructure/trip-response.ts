export interface TripResource {
  id: number;
  driverId: number;
  coDriverId: number | null;
  vehicleId: number;
  createdAt: string;
  updatedAt: string;
  departureAt: string | null;
  merchantId: number;
}

export interface TripsResponse {
  trips: TripResource[];
}
