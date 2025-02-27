import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { UserNotExists } from './errors/user-not-exists';

interface UpdateUserUseCaseRequest {
  userId: string;
  name: string;
}

type UpdateUserUseCaseResponse = Either<
  UserNotExists | NotAllowedError,
  {
    user: User;
  }
>;

@Injectable()
export class UpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new UserNotExists(userId));
    }

    user.name = name;

    await this.usersRepository.save(user);

    return right({
      user,
    });
  }
}
