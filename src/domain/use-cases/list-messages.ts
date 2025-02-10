import { Injectable } from '@nestjs/common';
import { Message } from '../entities/message';
import { MessagesRepository } from '../repositories/messages-repository';
import { ChatsRepository } from '../repositories/chats-repository';

interface ListMessagesUseCaseRequest {
  userId: string;
  chatId: string;
}

type ListMessagesUseCaseResponse = {
  messages: Message[];
};

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
      throw new Error('Chat not exists');
    }

    if (!chat.userIds.includes(userId)) {
      throw new Error('Unauthorized');
    }

    const messages = await this.messagesRepository.findManyByChatId(chatId);

    return {
      messages,
    };
  }
}
