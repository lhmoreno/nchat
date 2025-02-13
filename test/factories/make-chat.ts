import { randomUUID } from 'node:crypto';

import { Chat, ChatProps } from '@/domain/entities/chat';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ChatDoc } from '@/infra/database/mongoose/schemas/chat.schema';
import { MongooseChatMapper } from '@/infra/database/mongoose/mappers/mongoose-chat-mapper';

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

@Injectable()
export class ChatFactory {
  constructor(
    @Inject('CHAT_MODEL')
    private chatModel: Model<ChatDoc>,
  ) {}

  async makeMongooseChat(data: Partial<ChatProps> = {}): Promise<Chat> {
    const chat = makeChat(data);

    const res = await this.chatModel.create(
      MongooseChatMapper.toMongoose(chat),
    );

    return MongooseChatMapper.toDomain(res);
  }
}
