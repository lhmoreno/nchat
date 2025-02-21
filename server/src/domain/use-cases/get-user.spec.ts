import { GetUserUseCase } from './get-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserUseCase;

describe('Get User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to get a user', async () => {
    const user = makeUser();

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({ user: inMemoryUsersRepository.items[0] }),
    );
  });
});
