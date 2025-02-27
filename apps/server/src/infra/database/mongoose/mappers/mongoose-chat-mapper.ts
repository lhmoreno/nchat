import { Chat, ChatInput } from '@/domain/entities/chat';
import { ChatDoc } from '../schemas/chat.schema';
import { UserDoc } from '../schemas/user.schema';
import { ChatWithUser } from '@/domain/repositories/chats-repository';
import { MongooseUserMapper } from './mongoose-user-mapper';

export class MongooseChatMapper {
  static toDomain(raw: ChatDoc): Chat {
    return Chat.create(
      {
        userIds: [raw.userIds[0].toString(), raw.userIds[1].toString()],
        createdAt: raw.createdAt,
      },
      raw._id.toString(),
    );
  }

  static toDomainWithUsers(
    raw: Omit<ChatDoc, 'userIds'> & { userIds: [UserDoc, UserDoc] },
  ): ChatWithUser {
    return {
      id: raw._id.toString(),
      createdAt: raw.createdAt,
      users: [
        MongooseUserMapper.toDomain(raw.userIds[0]),
        MongooseUserMapper.toDomain(raw.userIds[1]),
      ],
    };
  }

  static toMongoose(chat: Chat): ChatInput {
    return {
      userIds: chat.userIds,
      createdAt: chat.createdAt,
    };
  }
}
