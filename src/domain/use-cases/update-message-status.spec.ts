import { UpdateMessageStatusUseCase } from './update-message-status';
import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';
import { InMemoryMessagesRepository } from 'test/repositories/in-memory-messages-repository';
import { makeMessage } from 'test/factories/make-message';
import { makeChat } from 'test/factories/make-chat';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryMessagesRepository: InMemoryMessagesRepository;
let inMemoryChatsRepository: InMemoryChatsRepository;

let sut: UpdateMessageStatusUseCase;

describe('Update Message Status', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository();
    inMemoryChatsRepository = new InMemoryChatsRepository();

    sut = new UpdateMessageStatusUseCase(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
    );
  });

  it('should be able to update a messages status', async () => {
    const chat = makeChat({
      userIds: [new UniqueEntityID('userId-1'), new UniqueEntityID('userId-2')],
    });
    const message = makeMessage({
      status: 'sent',
      senderId: chat.userIds[1],
      chatId: chat.id,
    });

    inMemoryChatsRepository.items.push(chat);
    inMemoryMessagesRepository.items.push(message);

    const result = await sut.execute({
      userId: 'userId-1',
      messageId: message.id.toString(),
      status: 'read',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        message: expect.objectContaining({
          status: 'read',
        }),
      }),
    );
  });

  it('should not be able to update a messages status from another user', async () => {
    const chat = makeChat({
      userIds: [new UniqueEntityID('userId-1'), new UniqueEntityID('userId-2')],
    });
    const message = makeMessage({
      status: 'sent',
      senderId: chat.userIds[1],
      chatId: chat.id,
    });

    inMemoryChatsRepository.items.push(chat);
    inMemoryMessagesRepository.items.push(message);

    const result = await sut.execute({
      userId: 'userId-3',
      messageId: message.id.toString(),
      status: 'read',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to update a messages status read', async () => {
    const chat = makeChat({
      userIds: [new UniqueEntityID('userId-1'), new UniqueEntityID('userId-2')],
    });
    const message = makeMessage({
      status: 'read',
      senderId: chat.userIds[1],
      chatId: chat.id,
    });

    inMemoryChatsRepository.items.push(chat);
    inMemoryMessagesRepository.items.push(message);

    const result = await sut.execute({
      userId: 'userId-1',
      messageId: message.id.toString(),
      status: 'read',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
