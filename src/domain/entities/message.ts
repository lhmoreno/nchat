import { randomUUID } from 'node:crypto';
import { Optional } from '../core/types/optional';

export interface MessageProps {
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
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

  get timestamp() {
    return this.props.timestamp;
  }

  static create(props: Optional<MessageProps, 'timestamp'>, id?: string) {
    const message = new Message(
      { ...props, timestamp: props.timestamp ?? new Date() },
      id,
    );

    return message;
  }
}
