import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { DeliveryOrder } from './delivery-order.entity';
import { OriginPoint } from './origin-point.entity';
import { TripStatus } from './trip-status.vo';

export class Trip implements BaseEntity {
  private _id: number;
  private _driverId: number;
  private _deviceId: number;
  private _vehicleId: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _merchantId: number;
  private _originPointId: number;
  private _startedAt: Date | null;
  private _completedAt: Date | null;
  private _originPoint: OriginPoint | null;
  private _deliveryOrders: DeliveryOrder[];
  private _status: TripStatus;

  constructor(trip: {
    id: number;
    driverId: number;
    vehicleId: number;
    deviceId: number;
    merchantId: number;
    originPointId: number;
    originPoint?: OriginPoint | null;
    deliveryOrders?: DeliveryOrder[];
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    status: TripStatus;
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
    this._deliveryOrders = trip.deliveryOrders ?? [];
    this._status = trip.status;
    this._deviceId = trip.deviceId;
  }

  static createEmpty(): Trip {
    return new Trip({
      id: 0,
      driverId: 0,
      vehicleId: 0,
      deviceId: 0,
      merchantId: 0,
      originPointId: 0,
      startedAt: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: TripStatus.CREATED,
    });
  }

  isCompleted(): boolean {
    return this._status === TripStatus.COMPLETED;
  }
  isInProgress(): boolean {
    return this._status === TripStatus.IN_PROGRESS;
  }
  isCreated(): boolean {
    return this._status === TripStatus.CREATED;
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
  set vehicleId(value: number) {
    this._vehicleId = value;
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
  set merchantId(value: number) {
    this._merchantId = value;
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

  get deliveryOrders(): DeliveryOrder[] {
    return this._deliveryOrders;
  }
  set deliveryOrders(value: DeliveryOrder[]) {
    this._deliveryOrders = value;
  }
  get status(): TripStatus {
    return this._status;
  }
  set status(value: TripStatus) {
    this._status = value;
  }

  get deviceId(): number {
    return this._deviceId;
  }
  set deviceId(value: number) {
    this._deviceId = value;
  }
}
