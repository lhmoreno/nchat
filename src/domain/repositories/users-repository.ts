import { User } from '../entities/user';

export abstract class UsersRepository {
  abstract findAll(): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract findById(userId: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
}
