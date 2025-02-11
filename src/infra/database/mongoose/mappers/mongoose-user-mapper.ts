import { User, UserProps } from '@/domain/entities/user';
import { UserDoc } from '../schemas/user.schema';

export class MongooseUserMapper {
  static toDomain(raw: UserDoc): User {
    return User.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
      },
      raw._id,
    );
  }

  static toMongoose(user: User): UserProps {
    return {
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
