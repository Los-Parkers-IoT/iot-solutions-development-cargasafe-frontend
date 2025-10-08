import {BaseEntity} from '../../../shared/domain/model/base-entity';

export class Alert implements BaseEntity{
  private _id: number;
  private _type: string;
  private _deliveryOrderId: string;
  private _status: 'Active' | 'Closed';
  private _createdAt: Date;
  private _closedAt: Date| null;
  private _description: string;


  constructor(alert: {
    id: number,
    type: string,
    deliveryOrderId: string,
    status: "Active" | "Closed",
    createdAt: Date,
    closedAt: Date | null,
    description: string
  }) {

    this._id = alert.id;
    this._type = alert.type;
    this._deliveryOrderId = alert.deliveryOrderId;
    this._status = alert.status;
    this._createdAt = alert.createdAt;
    this._closedAt = alert.closedAt;
    this._description = alert.description;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get deliveryOrderId(): string {
    return this._deliveryOrderId;
  }

  set deliveryOrderId(value: string) {
    this._deliveryOrderId = value;
  }

  get status(): "Active" | "Closed" {
    return this._status;
  }

  set status(value: "Active" | "Closed") {
    this._status = value;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
  }

  get closedAt(): Date | null {
    return this._closedAt;
  }

  set closedAt(value: Date | null) {
    this._closedAt = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }
}
