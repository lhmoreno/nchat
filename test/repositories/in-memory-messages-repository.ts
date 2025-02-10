import { MessagesRepository } from '@/domain/repositories/messages-repository';
import { Message } from '@/domain/entities/message';

export class InMemoryMessagesRepository implements MessagesRepository {
  public items: Message[] = [];

  async findManyByChatId(chatId: string) {
    const messages = this.items.filter((message) =>
      message.chatId.includes(chatId),
    );

    return messages;
  }

  async create(message: Message) {
    this.items.push(message);
  }
}
