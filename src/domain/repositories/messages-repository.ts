import { Message } from '../entities/message';

export abstract class MessagesRepository {
  abstract findManyByChatId(chatId: string): Promise<Message[]>;
  abstract findById(id: string): Promise<Message | null>;
  abstract create(message: Message): Promise<void>;
  abstract save(user: Message): Promise<void>;
}
