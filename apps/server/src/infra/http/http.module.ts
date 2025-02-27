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
import { UpdateMessageStatusUseCase } from '@/domain/use-cases/update-message-status';
import { UpdateUserUseCase } from '@/domain/use-cases/update-user';
import { UpdateUsernameUseCase } from '@/domain/use-cases/update-username';
import { UpdateMessageStatusController } from './controllers/update-message-status.controller';
import { UpdateUserController } from './controllers/update-user.controller';
import { UpdateUsernameController } from './controllers/update-username.controller';
import { EventsModule } from '../socket/events/events.module';
import { GetUserController } from './controllers/get-user.controller';
import { GetUserUseCase } from '@/domain/use-cases/get-user';

@Module({
  imports: [DatabaseModule, CryptographyModule, EventsModule],
  controllers: [
    AuthenticateController,
    CreateUserController,
    CreateMessageController,
    CreateChatController,
    ListUsersController,
    ListChatsController,
    ListMessagesController,
    UpdateMessageStatusController,
    UpdateUserController,
    UpdateUsernameController,
    GetUserController,
  ],
  providers: [
    AuthenticateUseCase,
    CreateUserUseCase,
    ListUsersUseCase,
    CreateChatUseCase,
    CreateMessageUseCase,
    ListChatsUseCase,
    ListMessagesUseCase,
    UpdateMessageStatusUseCase,
    UpdateUserUseCase,
    UpdateUsernameUseCase,
    GetUserUseCase,
  ],
})
export class HttpModule {}
