import { ListMessagesUseCase } from './list-messages';
import { InMemoryMessagesRepository } from 'test/repositories/in-memory-messages-repository';
import { makeMessage } from 'test/factories/make-message';
import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';
import { makeChat } from 'test/factories/make-chat';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

let inMemoryMessagesRepository: InMemoryMessagesRepository;
let inMemoryChatsRepository: InMemoryChatsRepository;
let sut: ListMessagesUseCase;

describe('List Messages', () => {
  beforeEach(() => {
    inMemoryMessagesRepository = new InMemoryMessagesRepository();
    inMemoryChatsRepository = new InMemoryChatsRepository();
    sut = new ListMessagesUseCase(
      inMemoryMessagesRepository,
      inMemoryChatsRepository,
    );
  });

  it('should be able to list messages', async () => {
    const chat = makeChat({ userIds: ['id-1', 'id-2'] });

    inMemoryChatsRepository.items.push(chat);

    const message1 = makeMessage({ chatId: chat.id, senderId: 'id-1' });
    const message2 = makeMessage({ chatId: chat.id, senderId: 'id-1' });

    inMemoryMessagesRepository.items.push(message1, message2);

    const result = await sut.execute({
      userId: 'id-1',
      chatId: chat.id,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      messages: [message1, message2],
    });
  });

  it('should not be able to list messages from another user', async () => {
    const chat = makeChat({ userIds: ['id-2', 'id-3'] });

    inMemoryChatsRepository.items.push(chat);

    const message1 = makeMessage({ chatId: chat.id, senderId: 'id-2' });
    const message2 = makeMessage({ chatId: chat.id, senderId: 'id-3' });

    inMemoryMessagesRepository.items.push(message1, message2);

    const result = await sut.execute({
      userId: 'id-1',
      chatId: chat.id,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
