import { makeUser } from 'test/factories/make-user';
import { CreateChatUseCase } from './create-chat';
import { InMemoryChatsRepository } from 'test/repositories/in-memory-chats-repository';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeChat } from 'test/factories/make-chat';
import { ChatAlreadyExistsError } from './errors/chat-already-exists-error';
import { UserNotExists } from './errors/user-not-exists';

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
      userIds: [user1.id.toString(), user2.id.toString()],
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      chat: inMemoryChatsRepository.items[0],
    });
  });

  it('should not be able to create with an existing chat', async () => {
    const user1 = makeUser();
    const user2 = makeUser();

    inMemoryUsersRepository.items.push(user1, user2);

    const chat = makeChat({
      userIds: [user2.id, user1.id],
    });

    inMemoryChatsRepository.items.push(chat);

    const result = await sut.execute({
      userIds: [user2.id.toString(), user1.id.toString()],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ChatAlreadyExistsError);
  });

  it('should not be able to create a chat if one of the users do not exist', async () => {
    const user1 = makeUser();

    inMemoryUsersRepository.items.push(user1);

    const result = await sut.execute({
      userIds: [user1.id.toString(), 'invalid-id'],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNotExists);
  });
});
