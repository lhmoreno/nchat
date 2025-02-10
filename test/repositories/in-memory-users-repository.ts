import { UsersRepository } from '@/domain/repositories/users-repository';
import { User } from '@/domain/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(userId: string) {
    const user = this.items.find((user) => user.id === userId);

    if (!user) {
      return null;
    }

    return user;
  }

  async findManyById(userId: string) {
    const users = this.items.filter((user) => user.id !== userId);

    return users;
  }

  async create(user: User) {
    this.items.push(user);
  }
}
