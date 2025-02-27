import { User, UserInput } from '@/domain/entities/user';
import { UserDoc } from '../schemas/user.schema';

export class MongooseUserMapper {
  static toDomain(raw: UserDoc): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        username: raw.username,
        passwordHash: raw.passwordHash,
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
      },
      raw._id.toString(),
    );
  }

  static toMongoose(user: User): UserInput {
    return {
      name: user.name,
      email: user.email,
      username: user.username,
      passwordHash: user.passwordHash,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
    };
  }
}
