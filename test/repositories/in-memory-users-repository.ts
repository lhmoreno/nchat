import { UsersRepository } from '@/domain/repositories/users-repository';
import { User } from '@/domain/entities/user';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find((user) => user.id === userId);

    if (!user) {
      return null;
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.items;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.items.find((user) => user.username === username);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User): Promise<void> {
    this.items.push(user);
  }
}
