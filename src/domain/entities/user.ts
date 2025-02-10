import { randomUUID } from 'node:crypto';
import { Optional } from '../core/types/optional';

export interface UserProps {
  name: string;
  createdAt: Date;
}

export class User {
  private _id: string;
  protected props: UserProps;

  protected constructor(props: UserProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: string) {
    const user = new User(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return user;
  }
}
