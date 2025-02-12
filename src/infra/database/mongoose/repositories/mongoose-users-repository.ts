import { Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from '@/domain/repositories/users-repository';
import { User } from '@/domain/entities/user';
import { MongooseUserMapper } from '../mappers/mongoose-user-mapper';
import { Model } from 'mongoose';
import { UserDoc } from '../schemas/user.schema';

@Injectable()
export class MongooseUsersRepository implements UsersRepository {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<UserDoc>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return null;
    }

    return MongooseUserMapper.toDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username });

    if (!user) {
      return null;
    }

    return MongooseUserMapper.toDomain(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();

    return users.map((user) => MongooseUserMapper.toDomain(user));
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      return null;
    }

    return MongooseUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = MongooseUserMapper.toMongoose(user);

    await this.userModel.create(data);
  }
}
