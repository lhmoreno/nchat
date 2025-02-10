import { Injectable } from '@nestjs/common';
import { Chat } from '../entities/chat';
import { ChatsRepository } from '../repositories/chats-repository';

interface ListChatsUseCaseRequest {
  userId: string;
}

type ListChatsUseCaseResponse = {
  chats: Chat[];
};

@Injectable()
export class ListChatsUseCase {
  constructor(private chatsRepository: ChatsRepository) {}

  async execute({
    userId,
  }: ListChatsUseCaseRequest): Promise<ListChatsUseCaseResponse> {
    const chats = await this.chatsRepository.findManyByUserId(userId);

    return {
      chats,
    };
  }
}
