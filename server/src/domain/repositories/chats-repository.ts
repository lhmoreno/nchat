import { Chat } from '../entities/chat';

export abstract class ChatsRepository {
  abstract findByUserIds(userIds: [string, string]): Promise<Chat | null>;
  abstract findById(id: string): Promise<Chat | null>;
  abstract findManyByUserId(userId: string): Promise<Chat[]>;
  abstract create(chat: Chat): Promise<void>;
}
