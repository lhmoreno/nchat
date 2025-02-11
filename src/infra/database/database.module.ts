import * as mongoose from 'mongoose';
import { UsersRepository } from '@/domain/repositories/users-repository';
import { Module } from '@nestjs/common';
import { MongooseUsersRepository } from './mongoose/repositories/mongoose-users-repository';
import { UserSchema } from './mongoose/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

const UserModel = {
  provide: 'USER_MODEL',
  useFactory: (connection: mongoose.Connection) =>
    connection.model('User', UserSchema),
  inject: ['DATABASE_CONNECTION'],
};

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (configService: ConfigService): Promise<typeof mongoose> => {
        const uri = configService.get<string>('DATABASE_URL');
        return mongoose.connect(uri);
      },
      inject: [ConfigService],
    },
    UserModel,
    {
      provide: UsersRepository,
      useClass: MongooseUsersRepository,
    },
  ],
  exports: [UserModel, UsersRepository],
})
export class DatabaseModule {}
