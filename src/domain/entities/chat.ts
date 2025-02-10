import { randomUUID } from 'node:crypto';
import { Optional } from '../core/types/optional';

export interface ChatProps {
  userIds: [string, string];
  createdAt: Date;
}

export class Chat {
  private _id: string;
  protected props: ChatProps;

  protected constructor(props: ChatProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get id() {
    return this._id;
  }

  get userIds() {
    return this.props.userIds;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<ChatProps, 'createdAt'>, id?: string) {
    const chat = new Chat(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return chat;
  }
}
