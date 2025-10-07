import { BaseEntity } from '../../../shared/domain/model/base-entity';
import { Trip } from './trip.entity';

export class Route implements BaseEntity {
  private _id: number;
  private _tripId: number;
  private _trip: Trip | null;
  private _tripStatusId: number;

  constructor(route: { id: number; tripId: number; trip?: Trip; tripStatusId: number }) {
    this._id = route.id;
    this._tripId = route.tripId;
    this._trip = route.trip ?? null;
    this._tripStatusId = route.tripStatusId;
  }

  get id(): number {
    return this._id;
  }

  get tripId(): number {
    return this._tripId;
  }

  get trip(): Trip | null {
    return this._trip;
  }

  get tripStatusId(): number {
    return this._tripStatusId;
  }
}
