import { AppModule } from '@/infra/app.module';
import { MongooseModule } from '@/infra/database/mongoose/mongoose.module';
import { MessageDoc } from '@/infra/database/mongoose/schemas/message.schema';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';
import { ChatFactory } from 'test/factories/make-chat';
import { UserFactory } from 'test/factories/make-user';

describe('Create Message (E2E)', () => {
  let app: INestApplication;
  let messageModel: Model<MessageDoc>;
  let userFactory: UserFactory;
  let chatFactory: ChatFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, MongooseModule],
      providers: [UserFactory, ChatFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    messageModel = moduleRef.get('MESSAGE_MODEL');
    userFactory = moduleRef.get(UserFactory);
    chatFactory = moduleRef.get(ChatFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[POST] /messages', async () => {
    const users = await Promise.all([
      userFactory.makeMongooseUser(),
      userFactory.makeMongooseUser(),
    ]);

    const chat = await chatFactory.makeMongooseChat({
      userIds: [users[0].id, users[1].id],
    });

    const accessToken = jwt.sign({ sub: users[0].id.toString() });

    const response = await request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        chatId: chat.id,
        content: 'Example message',
      });

    expect(response.statusCode).toBe(201);

    const messageOnDatabase = await messageModel.findOne({
      chatId: chat.id,
    });

    expect(messageOnDatabase).toBeTruthy();
  });
});
