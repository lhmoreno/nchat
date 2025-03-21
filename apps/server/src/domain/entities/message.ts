import { Optional } from '@/core/types/optional';
import { Entity } from '@/core/entities/entity';

export type MessageInput = Optional<
  MessageProps,
  'createdAt' | 'updatedAt' | 'status'
>;

interface MessageProps {
  chatId: string;
  senderId: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
}

export class Message extends Entity<MessageProps> {
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

  set status(status: 'sent' | 'delivered' | 'read') {
    this.props.status = status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: MessageInput, id?: string) {
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
