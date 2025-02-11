import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CreateUserUseCase } from '@/domain/use-cases/create-user';
import { ListUsersUseCase } from '@/domain/use-cases/list-users';
import { CreateUserController } from './controllers/create-user.controller';
import { ListUsersController } from './controllers/list-users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateUserController, ListUsersController],
  providers: [CreateUserUseCase, ListUsersUseCase],
})
export class HttpModule {}
