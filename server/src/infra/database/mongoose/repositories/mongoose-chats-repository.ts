import { Inject, Injectable } from '@nestjs/common';
import {
  ChatsRepository,
  ChatWithUser,
} from '@/domain/repositories/chats-repository';
import { Chat, ChatInput } from '@/domain/entities/chat';
import { MongooseChatMapper } from '../mappers/mongoose-chat-mapper';
import { Model } from 'mongoose';
import { ChatDoc } from '../schemas/chat.schema';
import { UserDoc } from '../schemas/user.schema';

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

  async findManyByUserId(userId: string): Promise<ChatWithUser[]> {
    const chats = await this.chatModel
      .find({
        userIds: { $elemMatch: { $eq: userId } },
      })
      .populate<{ userIds: [UserDoc, UserDoc] }>('userIds');

    return chats.map((chat) => MongooseChatMapper.toDomainWithUsers(chat));
  }

  async create(input: ChatInput): Promise<Chat> {
    const doc = await this.chatModel.create(input);

    const chat = Chat.create(input, doc._id.toString());

    return chat;
  }
}
