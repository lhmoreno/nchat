import { MessagesRepository } from '@/domain/repositories/messages-repository';
import { Message } from '@/domain/entities/message';

export class InMemoryMessagesRepository implements MessagesRepository {
  public items: Message[] = [];

  async findManyByChatId(chatId: string) {
    const messages = this.items.filter(
      (message) => message.chatId.toString() === chatId,
    );

    return messages;
  }

  async findById(id: string) {
    const message = this.items.find((item) => item.id.toString() === id);

    if (!message) {
      return null;
    }

    return message;
  }

  async create(message: Message) {
    this.items.push(message);
  }

  async save(message: Message): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === message.id);

    this.items[itemIndex] = message;
  }
}
