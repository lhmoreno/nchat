import { Injectable } from '@nestjs/common';
import { Chat } from '../entities/chat';
import { ChatsRepository } from '../repositories/chats-repository';
import { UsersRepository } from '../repositories/users-repository';
import { Either, left, right } from '@/core/either';
import { ChatAlreadyExistsError } from './errors/chat-already-exists-error';
import { UserNotExists } from './errors/user-not-exists';

interface CreateChatUseCaseRequest {
  userIds: [string, string];
}

type CreateChatUseCaseResponse = Either<
  ChatAlreadyExistsError | UserNotExists,
  {
    chat: Chat;
  }
>;

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
      return left(new ChatAlreadyExistsError());
    }

    const [user1, user2] = await Promise.all([
      this.usersRepository.findById(userIds[0]),
      this.usersRepository.findById(userIds[1]),
    ]);

    if (!user1) {
      return left(new UserNotExists(userIds[0]));
    }

    if (!user2) {
      return left(new UserNotExists(userIds[1]));
    }

    const chat = await this.chatsRepository.create({ userIds });

    return right({
      chat,
    });
  }
}
