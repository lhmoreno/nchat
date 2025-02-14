import { Message, MessageProps } from '@/domain/entities/message';
import { MessageDoc } from '../schemas/message.schema';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class MongooseMessageMapper {
  static toDomain(raw: MessageDoc): Message {
    return Message.create(
      {
        chatId: new UniqueEntityID(raw.chatId.toString()),
        senderId: new UniqueEntityID(raw.senderId.toString()),
        content: raw.content,
        status: raw.status,
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw._id.toString()),
    );
  }

  static toMongoose(message: Message): MessageProps {
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
