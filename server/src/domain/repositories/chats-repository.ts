import { Chat, ChatProps } from '../entities/chat';
import { User } from '../entities/user';

export type ChatWithUser = ChatProps & { id: string; users: [User, User] };

export abstract class ChatsRepository {
  abstract findByUserIds(userIds: [string, string]): Promise<Chat | null>;
  abstract findById(id: string): Promise<Chat | null>;
  abstract findManyByUserId(userId: string): Promise<ChatWithUser[]>;
  abstract create(chat: Chat): Promise<void>;
}
