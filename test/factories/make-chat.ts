import { randomUUID } from 'node:crypto';

import { Chat, ChatProps } from '@/domain/entities/chat';

export function makeChat(override: Partial<ChatProps> = {}, id?: string) {
  const chat = Chat.create(
    {
      userIds: [randomUUID(), randomUUID()],
      ...override,
    },
    id,
  );

  return chat;
}
