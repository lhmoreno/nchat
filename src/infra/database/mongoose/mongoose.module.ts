import * as mongoose from 'mongoose';
import { Module } from '@nestjs/common';
import { UserSchema } from './schemas/user.schema';
import { ChatSchema } from './schemas/chat.schema';
import { MessageSchema } from './schemas/message.schema';
import { EnvService } from '@/infra/env/env.service';
import { EnvModule } from '@/infra/env/env.module';

const UserModel = {
  provide: 'USER_MODEL',
  useFactory: (connection: mongoose.Connection) =>
    connection.model('User', UserSchema),
  inject: ['DATABASE_CONNECTION'],
};

const ChatModel = {
  provide: 'CHAT_MODEL',
  useFactory: (connection: mongoose.Connection) =>
    connection.model('Chat', ChatSchema),
  inject: ['DATABASE_CONNECTION'],
};

const MessageModel = {
  provide: 'MESSAGE_MODEL',
  useFactory: (connection: mongoose.Connection) =>
    connection.model('Message', MessageSchema),
  inject: ['DATABASE_CONNECTION'],
};

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: (envService: EnvService): Promise<mongoose.Connection> => {
        const uri = envService.get('DATABASE_URL');

        return mongoose.createConnection(uri ?? '').asPromise();
      },
      inject: [EnvService],
    },
    UserModel,
    ChatModel,
    MessageModel,
  ],
  exports: [UserModel, ChatModel, MessageModel],
})
export class MongooseModule {}
