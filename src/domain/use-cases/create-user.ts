import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UsersRepository } from '../repositories/users-repository';

interface CreateUserUseCaseRequest {
  name: string;
}

type CreateUserUseCaseResponse = {
  user: User;
};

@Injectable()
export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const user = User.create({
      name,
    });

    await this.usersRepository.create(user);

    return {
      user,
    };
  }
}
