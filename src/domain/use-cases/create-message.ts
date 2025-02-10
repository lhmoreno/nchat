import { Injectable } from '@nestjs/common';
import { Message } from '../entities/message';
import { MessagesRepository } from '../repositories/messages-repository';
import { ChatsRepository } from '../repositories/chats-repository';

interface CreateMessageUseCaseRequest {
  userId: string;
  chatId: string;
  content: string;
}

type CreateMessageUseCaseResponse = {
  message: Message;
};

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
    const chatExists = await this.chatsRepository.findById(chatId);

    if (!chatExists) {
      throw new Error('Chat not exists');
    }

    const message = Message.create({
      senderId: userId,
      chatId,
      content,
    });

    await this.messagesRepository.create(message);

    return {
      message,
    };
  }
}
