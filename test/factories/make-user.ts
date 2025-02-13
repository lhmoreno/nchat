import { faker } from '@faker-js/faker';

import { User, UserProps } from '@/domain/entities/user';
import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDoc } from '@/infra/database/mongoose/schemas/user.schema';
import { MongooseUserMapper } from '@/infra/database/mongoose/mappers/mongoose-user-mapper';

export function makeUser(override: Partial<UserProps> = {}, id?: string) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.username(),
      passwordHash: faker.internet.password(),
      ...override,
    },
    id,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<UserDoc>,
  ) {}

  async makeMongooseUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data);

    const res = await this.userModel.create(
      MongooseUserMapper.toMongoose(user),
    );

    return MongooseUserMapper.toDomain(res);
  }
}
