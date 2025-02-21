import { Chat, ChatProps } from '@/domain/entities/chat';
import { ChatDoc } from '../schemas/chat.schema';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserDoc } from '../schemas/user.schema';
import { ChatWithUser } from '@/domain/repositories/chats-repository';
import { MongooseUserMapper } from './mongoose-user-mapper';

export class MongooseChatMapper {
  static toDomain(raw: ChatDoc): Chat {
    return Chat.create(
      {
        userIds: [
          new UniqueEntityID(raw.userIds[0].toString()),
          new UniqueEntityID(raw.userIds[1].toString()),
        ],
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw._id.toString()),
    );
  }

  static toDomainWithUsers(
    raw: Omit<ChatDoc, 'userIds'> & { userIds: [UserDoc, UserDoc] },
  ): ChatWithUser {
    return {
      id: raw._id.toString(),
      userIds: [
        new UniqueEntityID(raw.userIds[0]._id.toString()),
        new UniqueEntityID(raw.userIds[1]._id.toString()),
      ],
      createdAt: raw.createdAt,
      users: [
        MongooseUserMapper.toDomain(raw.userIds[0]),
        MongooseUserMapper.toDomain(raw.userIds[1]),
      ],
    };
  }

  static toMongoose(chat: Chat): ChatProps {
    return {
      userIds: chat.userIds,
      createdAt: chat.createdAt,
    };
  }
}
