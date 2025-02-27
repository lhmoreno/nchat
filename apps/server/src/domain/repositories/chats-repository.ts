import { Chat, ChatInput } from '../entities/chat';
import { User } from '../entities/user';

export type ChatWithUser = {
  id: string;
  users: [User, User];
  createdAt: Date;
};

export abstract class ChatsRepository {
  abstract findByUserIds(userIds: [string, string]): Promise<Chat | null>;
  abstract findById(id: string): Promise<Chat | null>;
  abstract findManyByUserId(userId: string): Promise<ChatWithUser[]>;
  abstract create(chat: ChatInput): Promise<Chat>;
}
