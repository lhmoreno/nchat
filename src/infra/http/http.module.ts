import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CreateUserUseCase } from '@/domain/use-cases/create-user';
import { ListUsersUseCase } from '@/domain/use-cases/list-users';
import { CreateUserController } from './controllers/create-user.controller';
import { ListUsersController } from './controllers/list-users.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUseCase } from '@/domain/use-cases/authenticate';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateUserController,
    ListUsersController,
  ],
  providers: [AuthenticateUseCase, CreateUserUseCase, ListUsersUseCase],
})
export class HttpModule {}
