import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Trip implements BaseEntity {
  private _id: number;
  private _driverId: number;
  private _coDriverId: number | null;
  private _vehicleId: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _departureAt: Date | null;
  private _merchantId: number;

  constructor(trip: {
    id: number;
    driverId: number;
    coDriverId: number | null;
    vehicleId: number;
    createdAt: Date;
    updatedAt: Date;
    departureAt: Date | null;
    merchantId: number;
  }) {
    this._id = trip.id;
    this._driverId = trip.driverId;
    this._coDriverId = trip.coDriverId ?? null;
    this._vehicleId = trip.vehicleId;
    this._createdAt = trip.createdAt;
    this._updatedAt = trip.updatedAt;
    this._departureAt = trip.departureAt;
    this._merchantId = trip.merchantId;
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
}
