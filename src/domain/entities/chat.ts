import { Optional } from '@/core/types/optional';
import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface ChatProps {
  userIds: [UniqueEntityID, UniqueEntityID];
  createdAt: Date;
}

export class Chat extends Entity<ChatProps> {
  get userIds() {
    return this.props.userIds;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<ChatProps, 'createdAt'>, id?: UniqueEntityID) {
    const chat = new Chat(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    );

    return chat;
  }
}
