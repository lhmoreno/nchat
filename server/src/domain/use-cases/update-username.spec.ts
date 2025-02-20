import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';
import { UpdateUsernameUseCase } from './update-username';
import { UserNameAlreadyExistsError } from './errors/username-already-exists-error';

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: UpdateUsernameUseCase;

describe('Update Username', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new UpdateUsernameUseCase(inMemoryUsersRepository);
  });

  it('should be able to update a username', async () => {
    const user = makeUser({ username: 'username-1' });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      username: 'username-2',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          username: 'username-2',
        }),
      }),
    );
  });

  it('should not be able to update with same username', async () => {
    const username = 'john-doe';

    const user = makeUser({
      username,
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      username,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserNameAlreadyExistsError);
  });
});
