import { Message, MessageProps } from '@/domain/entities/message';
import { faker } from '@faker-js/faker';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MessageDoc } from '@/infra/database/mongoose/schemas/message.schema';
import { MongooseMessageMapper } from '@/infra/database/mongoose/mappers/mongoose-message-mapper';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export function makeMessage(
  override: Partial<MessageProps> = {},
  id?: UniqueEntityID,
) {
  const message = Message.create(
    {
      chatId: new UniqueEntityID(),
      senderId: new UniqueEntityID(),
      content: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(['read', 'delivered', 'read']),
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
