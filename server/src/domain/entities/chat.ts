import { Optional } from '@/core/types/optional';
import { Entity } from '@/core/entities/entity';

export type ChatInput = Optional<ChatProps, 'createdAt'>;

interface ChatProps {
  userIds: [string, string];
  createdAt: Date;
}

export class Chat extends Entity<ChatProps> {
  get userIds() {
    return this.props.userIds;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(input: ChatInput, id?: string) {
    const chat = new Chat(
      { ...input, createdAt: input.createdAt ?? new Date() },
      id,
    );

    return chat;
  }
}
