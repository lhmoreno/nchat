import { AppModule } from '@/infra/app.module';
import { MongooseModule } from '@/infra/database/mongoose/mongoose.module';
import { MessageDoc } from '@/infra/database/mongoose/schemas/message.schema';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import request from 'supertest';
import { ChatFactory } from 'test/factories/make-chat';
import { MessageFactory } from 'test/factories/make-message';
import { UserFactory } from 'test/factories/make-user';

describe('Update Message Status (E2E)', () => {
  let app: INestApplication;
  let messageModel: Model<MessageDoc>;
  let userFactory: UserFactory;
  let chatFactory: ChatFactory;
  let messageFactory: MessageFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, MongooseModule],
      providers: [UserFactory, ChatFactory, MessageFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    messageModel = moduleRef.get('MESSAGE_MODEL');
    userFactory = moduleRef.get(UserFactory);
    chatFactory = moduleRef.get(ChatFactory);
    messageFactory = moduleRef.get(MessageFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[PATCH] /messages/:id/status', async () => {
    const users = await Promise.all([
      userFactory.makeMongooseUser(),
      userFactory.makeMongooseUser(),
    ]);

    const chat = await chatFactory.makeMongooseChat({
      userIds: [users[0].id, users[1].id],
    });

    const message = await messageFactory.makeMongooseMessage({
      chatId: chat.id,
      senderId: users[1].id,
      status: 'delivered',
    });

    const accessToken = jwt.sign({ sub: users[0].id.toString() });

    const response = await request(app.getHttpServer())
      .patch(`/messages/${message.id}/status`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        status: 'read',
      });

    expect(response.statusCode).toBe(204);

    const messageOnDatabase = await messageModel.findOne({
      chatId: chat.id.toString(),
    });

    expect(messageOnDatabase?.status).toEqual('read');
  });
});
