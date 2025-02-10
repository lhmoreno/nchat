import { ListMessagesUseCase } from './list-messages';
import { InMemoryMessagesRepository } from 'test/repositories/in-memory-messages-repository';
import { makeMessage } from 'test/factories/make-message';
import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';
import { makeChat } from 'test/factories/make-chat';

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
    const message3 = makeMessage({ chatId: chat.id, senderId: 'id-2' });
    const message4 = makeMessage({ chatId: 'chat-2', senderId: 'id-1' });

    inMemoryMessagesRepository.items.push(
      message1,
      message2,
      message3,
      message4,
    );

    const result = await sut.execute({
      userId: 'id-1',
      chatId: chat.id,
    });

    expect(result.messages).toHaveLength(3);
  });
});
