import { UpdateUserUseCase } from './update-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { makeUser } from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: UpdateUserUseCase;

describe('Update User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new UpdateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to update a user', async () => {
    const user = makeUser();

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'Updated Name',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          name: 'Updated Name',
        }),
      }),
    );
  });
});
