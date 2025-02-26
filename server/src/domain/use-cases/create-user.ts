import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { Either, left, right } from '@/core/either';
import { HashGenerator } from '../cryptography/hash-generator';

type CreateUserUseCaseRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    username,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const [userWithSameEmail, userWithSameUsername] = await Promise.all([
      this.usersRepository.findByEmail(email),
      this.usersRepository.findByUsername(username),
    ]);

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email));
    }

    if (userWithSameUsername) {
      return left(new UserAlreadyExistsError(username));
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = await this.usersRepository.create({
      name,
      username,
      email,
      passwordHash: hashedPassword,
    });

    return right({
      user,
    });
  }
}
