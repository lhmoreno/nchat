import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { Either, left, right } from '@/core/either';
import { UserNameAlreadyExistsError } from './errors/username-already-exists-error';
import { UserNotExists } from './errors/user-not-exists';
import { UsersRepository } from '../repositories/users-repository';

interface UpdateUsernameUseCaseRequest {
  userId: string;
  username: string;
}

type UpdateUsernameUseCaseResponse = Either<
  UserNameAlreadyExistsError | UserNotExists,
  {
    user: User;
  }
>;

@Injectable()
export class UpdateUsernameUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
    username,
  }: UpdateUsernameUseCaseRequest): Promise<UpdateUsernameUseCaseResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return left(new UserNotExists(userId));
    }

    const usernameOnDatabase =
      await this.userRepository.findByUsername(username);

    if (usernameOnDatabase) {
      return left(new UserNameAlreadyExistsError(userId));
    }

    user.username = username;

    await this.userRepository.save(user);

    return right({
      user,
    });
  }
}
