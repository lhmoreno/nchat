import { randomUUID } from 'node:crypto';

import { Message, MessageProps } from '@/domain/entities/message';
import { faker } from '@faker-js/faker/.';

export function makeMessage(override: Partial<MessageProps> = {}, id?: string) {
  const message = Message.create(
    {
      chatId: randomUUID(),
      senderId: randomUUID(),
      content: faker.lorem.sentence(),
      ...override,
    },
    id,
  );

  return message;
}
