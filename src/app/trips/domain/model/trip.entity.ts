import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { OriginPoint } from './origin-point.entity';

export class Trip implements BaseEntity {
  private _id: number;
  private _driverId: number;
  private _vehicleId: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _merchantId: number;
  private _originPointId: number;
  private _startedAt: Date | null;
  private _completedAt: Date | null;
  private _originPoint: OriginPoint | null;

  constructor(trip: {
    id: number;
    driverId: number;
    vehicleId: number;
    merchantId: number;
    originPointId: number;
    originPoint?: OriginPoint | null;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = trip.id;
    this._driverId = trip.driverId;
    this._vehicleId = trip.vehicleId;
    this._merchantId = trip.merchantId;

    this._originPointId = trip.originPointId;
    this._originPoint = trip.originPoint ?? null;

    this._startedAt = trip.startedAt;
    this._completedAt = trip.completedAt;

    this._createdAt = trip.createdAt;
    this._updatedAt = trip.updatedAt;
  }

  get startedAt(): Date | null {
    return this._startedAt;
  }
  set startedAt(value: Date | null) {
    this._startedAt = value;
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }
  set completedAt(value: Date | null) {
    this._completedAt = value;
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

  get vehicleId(): number {
    return this._vehicleId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get merchantId(): number {
    return this._merchantId;
  }

  get originPointId(): number {
    return this._originPointId;
  }
  set originPointId(value: number) {
    this._originPointId = value;
  }
  get originPoint(): OriginPoint | null {
    return this._originPoint;
  }
}
