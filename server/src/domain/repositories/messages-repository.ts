import { Message, MessageInput } from '../entities/message';

export abstract class MessagesRepository {
  abstract findManyByChatId(chatId: string): Promise<Message[]>;
  abstract findById(id: string): Promise<Message | null>;
  abstract create(message: MessageInput): Promise<Message>;
  abstract save(message: Message): Promise<void>;
}
