import { Module } from '@nestjs/common';
import { MongooseModule } from './mongoose/mongoose.module';
import { UsersRepository } from '@/domain/repositories/users-repository';
import { MongooseUsersRepository } from './mongoose/repositories/mongoose-users-repository';
import { ChatsRepository } from '@/domain/repositories/chats-repository';
import { MongooseChatsRepository } from './mongoose/repositories/mongoose-chats-repository';
import { MessagesRepository } from '@/domain/repositories/messages-repository';
import { MongooseMessagesRepository } from './mongoose/repositories/mongoose-messages-repository';

@Module({
  imports: [MongooseModule],
  providers: [
    {
      provide: UsersRepository,
      useClass: MongooseUsersRepository,
    },
    {
      provide: ChatsRepository,
      useClass: MongooseChatsRepository,
    },
    {
      provide: MessagesRepository,
      useClass: MongooseMessagesRepository,
    },
  ],
  exports: [UsersRepository, ChatsRepository, MessagesRepository],
})
export class DatabaseModule {}
