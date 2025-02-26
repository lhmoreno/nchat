import { Message, MessageInput } from '@/domain/entities/message';
import { MessageDoc } from '../schemas/message.schema';

export class MongooseMessageMapper {
  static toDomain(raw: MessageDoc): Message {
    return Message.create(
      {
        chatId: raw.chatId.toString(),
        senderId: raw.senderId.toString(),
        content: raw.content,
        status: raw.status,
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
      },
      raw._id.toString(),
    );
  }

  static toMongoose(message: Message): MessageInput {
    return {
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content,
      status: message.status,
      updatedAt: message.updatedAt,
      createdAt: message.createdAt,
    };
  }
}
