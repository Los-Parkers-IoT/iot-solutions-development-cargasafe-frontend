export interface TripResource {
  id: number;
  statusId: number;
  driverId: number;
  vehicleId: number;
  departureAt: string | null;
  merchantId: number;
  originPointId: number;
  startedAt: string | null;
  completedAt: string | null;
  status: 'CREATED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

export interface TripsResponse {
  trips: TripResource[];
}
