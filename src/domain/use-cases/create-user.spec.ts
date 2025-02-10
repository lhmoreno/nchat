import { CreateUserUseCase } from './create-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
    });

    expect(result.user.id).toEqual(expect.any(String));
    expect(inMemoryUsersRepository.items[0]).toEqual(result.user);
  });
});
