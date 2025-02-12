import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { AuthenticateUseCase } from './authenticate';
import { makeUser } from 'test/factories/make-user';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: AuthenticateUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      encrypter,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      passwordHash: await fakeHasher.hash('123456'),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });

  it('should not be able to authenticate a user wrong credentials', async () => {
    const user = makeUser({
      email: 'johndoe@example.com',
      passwordHash: await fakeHasher.hash('123456'),
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '12345678',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(WrongCredentialsError);
  });
});
