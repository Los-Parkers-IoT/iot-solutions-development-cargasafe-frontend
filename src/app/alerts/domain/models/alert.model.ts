import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Incident} from './incident.model';
import { Notification} from './notification.model';

export class Alert implements BaseEntity {
  private _id: number;
  private _alertType: string;
  private _alertStatus: 'OPEN' | 'ACKNOWLEDGED' | 'CLOSED';
  private _description: string;
  private _createdAt: Date;
  private _closedAt: Date | null;
  private _incidents: Incident[];
  private _notifications: Notification[];

  private _viewed: boolean = false;

  constructor(alert: {
    id: number;
    alertType: string;
    alertStatus: 'OPEN' | 'ACKNOWLEDGED' | 'CLOSED';
    description: string;
    createdAt: Date;
    closedAt: Date | null;
    incidents: Incident[];
    notifications: Notification[];
  }) {
    this._id = alert.id;
    this._alertType = alert.alertType;
    this._alertStatus = alert.alertStatus;
    this._description = alert.description;
    this._createdAt = new Date(alert.createdAt);
    this._closedAt = alert.closedAt ? new Date(alert.closedAt) : null;

    this._incidents = alert.incidents || [];
    this._notifications = alert.notifications || [];
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get alertType(): string {
    return this._alertType;
  }

  set alertType(value: string) {
    this._alertType = value;
  }

  get alertStatus(): "OPEN" | "ACKNOWLEDGED" | "CLOSED" {
    return this._alertStatus;
  }

  set alertStatus(value: "OPEN" | "ACKNOWLEDGED" | "CLOSED") {
    this._alertStatus = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
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

  get incidents(): Incident[] {
    return this._incidents;
  }

  set incidents(value: Incident[]) {
    this._incidents = value;
  }

  get notifications(): Notification[] {
    return this._notifications;
  }

  set notifications(value: Notification[]) {
    this._notifications = value;
  }

  get viewed(): boolean {
    return this._viewed;
  }

  set viewed(value: boolean) {
    this._viewed = value;
  }
}
