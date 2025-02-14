import { makeUser } from 'test/factories/make-user';
import { ListUsersUseCase } from './list-users';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: ListUsersUseCase;

describe('List Users', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new ListUsersUseCase(inMemoryUsersRepository);
  });

  it('should be able to list users', async () => {
    const user1 = makeUser();
    const user2 = makeUser();
    const user3 = makeUser();

    inMemoryUsersRepository.items.push(user1, user2, user3);

    const result = await sut.execute({
      userId: user1.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.users).toHaveLength(2);
  });
});
