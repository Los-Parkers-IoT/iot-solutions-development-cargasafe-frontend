import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Trip implements BaseEntity {
  private _id: number;
  private _statusId: number;
  private _driverId: number;
  private _coDriverId: number | null;
  private _vehicleId: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _departureAt: Date | null;
  private _merchantId: number;
  private _originPointId: number;
  private _polyline_encrypted: string;
  private _totalDistanceKm: number;
  private _totalDurationMin: number;

  constructor(trip: {
    id: number;
    statusId: number;
    driverId: number;
    coDriverId: number | null;
    vehicleId: number;
    createdAt: Date;
    updatedAt: Date;
    departureAt: Date | null;
    merchantId: number;
    originPointId: number;
    polyline_encrypted: string;
    totalDistanceKm: number;
    totalDurationMin: number;
  }) {
    this._id = trip.id;
    this._statusId = trip.statusId;
    this._driverId = trip.driverId;
    this._coDriverId = trip.coDriverId ?? null;
    this._vehicleId = trip.vehicleId;
    this._createdAt = trip.createdAt;
    this._updatedAt = trip.updatedAt;
    this._departureAt = trip.departureAt;
    this._merchantId = trip.merchantId;
    this._totalDistanceKm = trip.totalDistanceKm;
    this._totalDurationMin = trip.totalDurationMin;
    this._originPointId = trip.originPointId;
    this._polyline_encrypted = trip.polyline_encrypted;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get driverId(): number {
    return this._driverId;
  }
  set driverId(value: number) {
    this._driverId = value;
  }

  get coDriverId(): number | null {
    return this._coDriverId;
  }

  set coDriverId(value: number | null) {
    this._coDriverId = value;
  }

  get vehicleId(): number {
    return this._vehicleId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get departureAt(): Date | null {
    return this._departureAt;
  }

  get merchantId(): number {
    return this._merchantId;
  }

  get statusId(): number {
    return this._statusId;
  }
  set statusId(value: number) {
    this._statusId = value;
  }

  get totalDistanceKm(): number {
    return this._totalDistanceKm;
  }
  set totalDistanceKm(value: number) {
    this._totalDistanceKm = value;
  }
  get totalDurationMin(): number {
    return this._totalDurationMin;
  }
  set totalDurationMin(value: number) {
    this._totalDurationMin = value;
  }

  get originPointId(): number {
    return this._originPointId;
  }
  set originPointId(value: number) {
    this._originPointId = value;
  }
  get polyline_encrypted(): string {
    return this._polyline_encrypted;
  }
  set polyline_encrypted(value: string) {
    this._polyline_encrypted = value;
  }
}
