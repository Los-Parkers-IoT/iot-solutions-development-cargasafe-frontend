import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Trip } from './trip.entity';

export class DeliveryOrder implements BaseEntity {
  private _id: number;
  private _clientEmail: string;
  private _address: string;
  private _latitude: number;
  private _longitude: number;
  private _sequenceOrder: number;
  private _arrivalAt: Date;
  private _notes: string;
  private _deliveryOrderStatusId: number;
  private _realArrivalAt: Date | null;
  private _maxHumidity: number;
  private _minHumidity: number;
  private _maxTemperature: number;
  private _minTemperature: number;
  private _maxVibration: number;
  private _tripId: number;
  private _trip: Trip | null;

  constructor(deliveryOrder: {
    id: number;
    clientEmail: string;
    address: string;
    latitude: number;
    longitude: number;
    sequenceOrder: number;
    arrivalAt: Date;
    notes: string;
    deliveryOrderStatusId: number;
    realArrivalAt: Date | null;
    maxHumidity: number;
    minHumidity: number;
    maxTemperature: number;
    minTemperature: number;
    maxVibration: number;
    tripId: number;
    trip: Trip | null;
  }) {
    this._id = deliveryOrder.id;
    this._clientEmail = deliveryOrder.clientEmail;
    this._address = deliveryOrder.address;
    this._latitude = deliveryOrder.latitude;
    this._longitude = deliveryOrder.longitude;
    this._sequenceOrder = deliveryOrder.sequenceOrder;
    this._arrivalAt = deliveryOrder.arrivalAt;
    this._notes = deliveryOrder.notes;
    this._deliveryOrderStatusId = deliveryOrder.deliveryOrderStatusId;
    this._realArrivalAt = deliveryOrder.realArrivalAt;
    this._maxHumidity = deliveryOrder.maxHumidity;
    this._minHumidity = deliveryOrder.minHumidity;
    this._maxTemperature = deliveryOrder.maxTemperature;
    this._minTemperature = deliveryOrder.minTemperature;
    this._maxVibration = deliveryOrder.maxVibration;
    this._tripId = deliveryOrder.tripId;
    this._trip = deliveryOrder.trip;
  }

  get id(): number {
    return this._id;
  }
  get clientEmail(): string {
    return this._clientEmail;
  }
  get address(): string {
    return this._address;
  }
  get latitude(): number {
    return this._latitude;
  }
  get longitude(): number {
    return this._longitude;
  }
  get sequenceOrder(): number {
    return this._sequenceOrder;
  }
  get arrivalAt(): Date {
    return this._arrivalAt;
  }
  get notes(): string {
    return this._notes;
  }
  get deliveryOrderStatusId(): number {
    return this._deliveryOrderStatusId;
  }
  get realArrivalAt(): Date | null {
    return this._realArrivalAt;
  }
  get maxHumidity(): number {
    return this._maxHumidity;
  }
  get minHumidity(): number {
    return this._minHumidity;
  }
  get maxTemperature(): number {
    return this._maxTemperature;
  }
  get minTemperature(): number {
    return this._minTemperature;
  }
  get maxVibration(): number {
    return this._maxVibration;
  }
  get tripId(): number {
    return this._tripId;
  }
  get trip(): Trip | null {
    return this._trip;
  }

  set trip(value: Trip | null) {
    this._trip = value;
  }
  set id(value: number) {
    this._id = value;
  }
  set clientEmail(value: string) {
    this._clientEmail = value;
  }
  set address(value: string) {
    this._address = value;
  }
  set latitude(value: number) {
    this._latitude = value;
  }
  set longitude(value: number) {
    this._longitude = value;
  }
  set sequenceOrder(value: number) {
    this._sequenceOrder = value;
  }
  set arrivalAt(value: Date) {
    this._arrivalAt = value;
  }
  set notes(value: string) {
    this._notes = value;
  }
  set deliveryOrderStatusId(value: number) {
    this._deliveryOrderStatusId = value;
  }
  set realArrivalAt(value: Date | null) {
    this._realArrivalAt = value;
  }
  set maxHumidity(value: number) {
    this._maxHumidity = value;
  }
  set minHumidity(value: number) {
    this._minHumidity = value;
  }
  set maxTemperature(value: number) {
    this._maxTemperature = value;
  }
  set minTemperature(value: number) {
    this._minTemperature = value;
  }
  set maxVibration(value: number) {
    this._maxVibration = value;
  }
  set tripId(value: number) {
    this._tripId = value;
  }
}
