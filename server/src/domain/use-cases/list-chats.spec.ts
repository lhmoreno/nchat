import { makeUser } from 'test/factories/make-user';
import { ListChatsUseCase } from './list-chats';
import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeChat } from 'test/factories/make-chat';

let inMemoryChatsRepository: InMemoryChatsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: ListChatsUseCase;

describe('List Chats', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new ListChatsUseCase(inMemoryChatsRepository);
  });

  it('should be able to list chats', async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    const user3 = makeUser();

    inMemoryUsersRepository.items.push(user1, user2, user3);

    const chat1 = makeChat({ userIds: [user1.id, user2.id] });
    const chat2 = makeChat({ userIds: [user1.id, user3.id] });
    const chat3 = makeChat({ userIds: [user2.id, user3.id] });

    inMemoryChatsRepository.items.push(chat1, chat2, chat3);

    const result = await sut.execute({
      userId: user1.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.chats).toHaveLength(2);
  });
});
