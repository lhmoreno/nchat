import { Message } from '../entities/message';

export abstract class MessagesRepository {
  abstract findManyByChatId(chatId: string): Promise<Message[]>;
  abstract create(message: Message): Promise<void>;
}
