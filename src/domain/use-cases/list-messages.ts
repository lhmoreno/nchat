import { Injectable } from '@nestjs/common';
import { Message } from '../entities/message';
import { MessagesRepository } from '../repositories/messages-repository';
import { ChatsRepository } from '../repositories/chats-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface ListMessagesUseCaseRequest {
  userId: string;
  chatId: string;
}

type ListMessagesUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    messages: Message[];
  }
>;

@Injectable()
export class ListMessagesUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private chatsRepository: ChatsRepository,
  ) {}

  async execute({
    userId,
    chatId,
  }: ListMessagesUseCaseRequest): Promise<ListMessagesUseCaseResponse> {
    const chat = await this.chatsRepository.findById(chatId);

    if (!chat) {
      return left(new ResourceNotFoundError());
    }

    if (!chat.userIds.includes(userId)) {
      return left(new NotAllowedError());
    }

    const messages = await this.messagesRepository.findManyByChatId(chatId);

    return right({
      messages,
    });
  }
}
