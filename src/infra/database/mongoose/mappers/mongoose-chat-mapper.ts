import { Chat, ChatProps } from '@/domain/entities/chat';
import { ChatDoc } from '../schemas/chat.schema';

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

  static toMongoose(chat: Chat): ChatProps {
    return {
      userIds: chat.userIds,
      createdAt: chat.createdAt,
    };
  }
}
