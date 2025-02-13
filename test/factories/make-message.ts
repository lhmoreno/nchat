import { randomUUID } from 'node:crypto';

import { Message, MessageProps } from '@/domain/entities/message';
import { faker } from '@faker-js/faker/.';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MessageDoc } from '@/infra/database/mongoose/schemas/message.schema';
import { MongooseMessageMapper } from '@/infra/database/mongoose/mappers/mongoose-message-mapper';

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

@Injectable()
export class MessageFactory {
  constructor(
    @Inject('MESSAGE_MODEL')
    private messageModel: Model<MessageDoc>,
  ) {}

  async makeMongooseMessage(
    data: Partial<MessageProps> = {},
  ): Promise<Message> {
    const message = makeMessage(data);

    const res = await this.messageModel.create(
      MongooseMessageMapper.toMongoose(message),
    );

    return MongooseMessageMapper.toDomain(res);
  }
}
