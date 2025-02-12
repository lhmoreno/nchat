import { Injectable } from '@nestjs/common';
import { Message } from '../entities/message';
import { MessagesRepository } from '../repositories/messages-repository';
import { ChatsRepository } from '../repositories/chats-repository';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

interface CreateMessageUseCaseRequest {
  userId: string;
  chatId: string;
  content: string;
}

type CreateMessageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    message: Message;
  }
>;

@Injectable()
export class CreateMessageUseCase {
  constructor(
    private messagesRepository: MessagesRepository,
    private chatsRepository: ChatsRepository,
  ) {}

  async execute({
    userId,
    chatId,
    content,
  }: CreateMessageUseCaseRequest): Promise<CreateMessageUseCaseResponse> {
    const chat = await this.chatsRepository.findById(chatId);

    if (!chat) {
      return left(new ResourceNotFoundError());
    }

    if (!chat.userIds.includes(userId)) {
      return left(new NotAllowedError());
    }

    const message = Message.create({
      senderId: userId,
      chatId,
      content,
    });

    await this.messagesRepository.create(message);

    return right({
      message,
    });
  }
}
