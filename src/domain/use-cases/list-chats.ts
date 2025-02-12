import { Injectable } from '@nestjs/common';
import { Chat } from '../entities/chat';
import { ChatsRepository } from '../repositories/chats-repository';
import { Either, right } from '@/core/either';

interface ListChatsUseCaseRequest {
  userId: string;
}

type ListChatsUseCaseResponse = Either<
  null,
  {
    chats: Chat[];
  }
>;

@Injectable()
export class ListChatsUseCase {
  constructor(private chatsRepository: ChatsRepository) {}

  async execute({
    userId,
  }: ListChatsUseCaseRequest): Promise<ListChatsUseCaseResponse> {
    const chats = await this.chatsRepository.findManyByUserId(userId);

    return right({
      chats,
    });
  }
}
