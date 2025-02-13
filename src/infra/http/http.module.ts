import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CreateUserUseCase } from '@/domain/use-cases/create-user';
import { ListUsersUseCase } from '@/domain/use-cases/list-users';
import { CreateUserController } from './controllers/create-user.controller';
import { ListUsersController } from './controllers/list-users.controller';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUseCase } from '@/domain/use-cases/authenticate';
import { CreateChatUseCase } from '@/domain/use-cases/create-chat';
import { CreateMessageUseCase } from '@/domain/use-cases/create-message';
import { ListChatsUseCase } from '@/domain/use-cases/list-chats';
import { ListMessagesUseCase } from '@/domain/use-cases/list-messages';
import { CreateMessageController } from './controllers/create-message.controller';
import { CreateChatController } from './controllers/create-chat.controller';
import { ListChatsController } from './controllers/list-chats.controller';
import { ListMessagesController } from './controllers/list-messages.controller';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateUserController,
    CreateMessageController,
    CreateChatController,
    ListUsersController,
    ListChatsController,
    ListMessagesController,
  ],
  providers: [
    AuthenticateUseCase,
    CreateUserUseCase,
    ListUsersUseCase,
    CreateChatUseCase,
    CreateMessageUseCase,
    ListChatsUseCase,
    ListMessagesUseCase,
  ],
})
export class HttpModule {}
