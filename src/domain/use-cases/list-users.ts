import { Injectable } from '@nestjs/common';
import { User } from '../entities/user';
import { UsersRepository } from '../repositories/users-repository';
import { Either, right } from '@/core/either';

interface ListUsersUseCaseRequest {
  userId: string;
}

type ListUsersUseCaseResponse = Either<
  null,
  {
    users: User[];
  }
>;

@Injectable()
export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    const users = await this.usersRepository.findAll();

    const usersWithoutMe = users.filter(
      (user) => user.id.toString() !== userId,
    );

    return right({
      users: usersWithoutMe,
    });
  }
}
