import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { MessagesRepository } from '../repositories/messages-repository';
import { ChatsRepository } from '../repositories/chats-repository';
import { Message } from '../entities/message';

interface UpdateMessageStatusUseCaseRequest {
  userId: string;
  messageId: string;
  status: 'delivered' | 'read';
}

type UpdateMessageStatusUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    message: Message;
    senderId: string;
  }
>;

@Injectable()
export class UpdateMessageStatusUseCase {
  constructor(
    private messageRepository: MessagesRepository,
    private chatRepository: ChatsRepository,
  ) {}

  async execute({
    userId,
    messageId,
    status,
  }: UpdateMessageStatusUseCaseRequest): Promise<UpdateMessageStatusUseCaseResponse> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      return left(new ResourceNotFoundError());
    }

    if (message.senderId.toString() === userId) {
      return left(new NotAllowedError());
    }

    const chat = await this.chatRepository.findById(message.chatId.toString());

    if (!chat) {
      return left(new ResourceNotFoundError());
    }

    if (!chat.userIds.some((id) => id.toString() === userId)) {
      return left(new NotAllowedError());
    }

    if (message.status === 'read') {
      return left(new NotAllowedError());
    }

    message.status = status;

    await this.messageRepository.save(message);

    return right({
      message,
      senderId: message.senderId.toString(),
    });
  }
}
