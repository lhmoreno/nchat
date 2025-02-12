import { Inject, Injectable } from '@nestjs/common';
import { ChatsRepository } from '@/domain/repositories/chats-repository';
import { Chat } from '@/domain/entities/chat';
import { MongooseChatMapper } from '../mappers/mongoose-chat-mapper';
import { Model } from 'mongoose';
import { ChatDoc } from '../schemas/chat.schema';

@Injectable()
export class MongooseChatsRepository implements ChatsRepository {
  constructor(
    @Inject('CHAT_MODEL')
    private chatModel: Model<ChatDoc>,
  ) {}

  async findByUserIds(userIds: [string, string]): Promise<Chat | null> {
    const chat = await this.chatModel.findOne({ userIds });

    if (!chat) {
      return null;
    }

    return MongooseChatMapper.toDomain(chat);
  }

  async findById(id: string): Promise<Chat | null> {
    const chat = await this.chatModel.findById(id);

    if (!chat) {
      return null;
    }

    return MongooseChatMapper.toDomain(chat);
  }

  async findManyByUserId(userId: string): Promise<Chat[]> {
    const chats = await this.chatModel.find({ userId });

    return chats.map((chat) => MongooseChatMapper.toDomain(chat));
  }

  async create(chat: Chat): Promise<void> {
    await this.chatModel.create(chat);
  }
}
