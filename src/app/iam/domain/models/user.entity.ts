import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class User implements BaseEntity {
  private _id: number;
  private _email: string;

  constructor(args: { id: number; email: string }) {
    this._id = args.id;
    this._email = args.email;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }
}
