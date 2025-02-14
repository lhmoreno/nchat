import { Chat, ChatProps } from '@/domain/entities/chat';
import { ChatDoc } from '../schemas/chat.schema';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

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

  static toMongoose(chat: Chat): ChatProps {
    return {
      userIds: chat.userIds,
      createdAt: chat.createdAt,
    };
  }
}
