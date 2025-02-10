import { Injectable } from '@nestjs/common';
import { Chat } from '../entities/chat';
import { ChatsRepository } from '../repositories/chats-repository';
import { UsersRepository } from '../repositories/users-repository';

interface CreateChatUseCaseRequest {
  userIds: [string, string];
}

type CreateChatUseCaseResponse = {
  chat: Chat;
};

@Injectable()
export class CreateChatUseCase {
  constructor(
    private chatsRepository: ChatsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userIds,
  }: CreateChatUseCaseRequest): Promise<CreateChatUseCaseResponse> {
    const chatExists = await this.chatsRepository.findByUserIds(userIds);

    if (chatExists) {
      throw new Error('Chat already exists');
    }

    const [user1, user2] = await Promise.all([
      this.usersRepository.findById(userIds[0]),
      this.usersRepository.findById(userIds[1]),
    ]);

    if (!user1 || !user2) {
      throw new Error('Users not exists');
    }

    const chat = Chat.create({
      userIds,
    });

    await this.chatsRepository.create(chat);

    return {
      chat,
    };
  }
}
