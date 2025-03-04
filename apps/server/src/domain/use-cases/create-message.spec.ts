import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';
import { CreateMessageUseCase } from './create-message';
import { InMemoryMessagesRepository } from 'test/repositories/in-memory-messages-repository';
import { makeChat } from 'test/factories/make-chat';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let inMemoryMessagesRepository: InMemoryMessagesRepository;
let inMemoryChatsRepository: InMemoryChatsRepository;
let sut: CreateMessageUseCase;

describe('Create Message', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository();
    inMemoryChatsRepository = new InMemoryChatsRepository();
    sut = new CreateMessageUseCase(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
    );
  });

  it('should be able to create a new message', async () => {
    const chat = makeChat({
      userIds: [new UniqueEntityID('userId-1'), new UniqueEntityID('userId-2')],
    });

    inMemoryChatsRepository.items.push(chat);

    const result = await sut.execute({
      userId: 'userId-1',
      chatId: chat.id.toString(),
      content: 'Example message',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value.message).toEqual(inMemoryMessagesRepository.items[0]);
  });
});
