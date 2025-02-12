import { ChatsRepository } from '@/domain/repositories/chats-repository';
import { Chat } from '@/domain/entities/chat';

export class InMemoryChatsRepository implements ChatsRepository {
  public items: Chat[] = [];

  async findByUserIds(userIds: [string, string]) {
    const chat = this.items.find((chat) => {
      return (
        chat.userIds.includes(userIds[0]) && chat.userIds.includes(userIds[1])
      );
    });

    if (!chat) {
      return null;
    }

    return chat;
  }

  async findById(id: string) {
    const chat = this.items.find((chat) => chat.id === id);

    if (!chat) {
      return null;
    }

    return chat;
  }

  async findManyByUserId(userId: string) {
    const chats = this.items.filter((chat) => chat.userIds.includes(userId));

    return chats;
  }

  async create(chat: Chat) {
    this.items.push(chat);
  }
}
