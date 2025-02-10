import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UsersRepository } from '../repositories/users-repository';

interface ListUsersUseCaseRequest {
  userId: string;
}

type ListUsersUseCaseResponse = {
  users: User[];
};

@Injectable()
export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    const users = await this.usersRepository.findManyById(userId);

    return {
      users,
    };
  }
}
