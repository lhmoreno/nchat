import { makeUser } from 'test/factories/make-user';
import { CreateChatUseCase } from './create-chat';
import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryChatsRepository: InMemoryChatsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateChatUseCase;

describe('Create Chat', () => {
  beforeEach(() => {
    inMemoryChatsRepository = new InMemoryChatsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateChatUseCase(
      inMemoryChatsRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to create a new chat', async () => {
    const user1 = makeUser();
    const user2 = makeUser();

    inMemoryUsersRepository.items.push(user1, user2);

    const result = await sut.execute({
      userIds: [user1.id, user2.id],
    });

    expect(result.chat.id).toEqual(expect.any(String));
    expect(inMemoryChatsRepository.items[0]).toEqual(result.chat);
  });

  it('should not be able to create with an existing chat', async () => {
    const user1 = makeUser();
    const user2 = makeUser();

    inMemoryUsersRepository.items.push(user1, user2);

    await sut.execute({
      userIds: [user2.id, user1.id],
    });

    await expect(
      sut.execute({
        userIds: [user1.id, user2.id],
      }),
    ).rejects.toThrow('Chat already exists');
  });

  it('should not be able to create a chat if one of the users do not exist', async () => {
    const user1 = makeUser();

    inMemoryUsersRepository.items.push(user1);

    await expect(
      sut.execute({
        userIds: [user1.id, 'invalid-id'],
      }),
    ).rejects.toThrow('Users not exists');
  });
});
