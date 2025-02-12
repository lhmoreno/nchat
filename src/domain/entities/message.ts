import { randomUUID } from 'node:crypto';
import { Optional } from '../../core/types/optional';

export interface MessageProps {
  chatId: string;
  senderId: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

export class Message {
  private _id: string;
  protected props: MessageProps;

  protected constructor(props: MessageProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }

  get id() {
    return this._id;
  }

  get chatId() {
    return this.props.chatId;
  }

  get senderId() {
    return this.props.senderId;
  }

  get content() {
    return this.props.content;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(
    props: Optional<MessageProps, 'createdAt' | 'updatedAt' | 'status'>,
    id?: string,
  ) {
    const message = new Message(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        status: props.status ?? 'sent',
      },
      id,
    );

    return message;
  }
}
