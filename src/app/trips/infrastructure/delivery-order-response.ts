export interface DeliveryOrderResource {
  id: number;
  clientEmail: string;
  address: string;
  latitude: number;
  longitude: number;
  sequenceOrder: number;
  arrivalAt: string;
  notes: string;
  deliveryOrderStatusId: number;
  realArrivalAt: string | null;
  maxHumidity: number;
  minHumidity: number;
  maxTemperature: number;
  minTemperature: number;
  maxVibration: number;
  tripId: number;
}
