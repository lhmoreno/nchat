import { randomUUID } from 'node:crypto';
import { Optional } from '../../core/types/optional';

export interface UserProps {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
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

  get username() {
    return this.props.username;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'updatedAt'>,
    id?: string,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
