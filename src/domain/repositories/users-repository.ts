import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract findManyById(userId: string): Promise<User[]>;
  abstract findById(userId: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
}
