import { FakeHasher } from 'test/cryptography/fake-hasher';
import { CreateUserUseCase } from './create-user';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { makeUser } from 'test/factories/make-user';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;

let sut: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();

    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it('should be able to create a new user', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      username: 'john-doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    });
  });

  it('should hash user password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      username: 'john-doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].passwordHash).toEqual(
      hashedPassword,
    );
  });

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com';

    const user = makeUser({
      email,
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      name: 'John Doe',
      username: 'john-doe-2',
      email,
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should not be able to register with same username twice', async () => {
    const username = 'john-doe';

    const user = makeUser({
      username,
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username,
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError);
  });
});
