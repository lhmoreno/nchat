import { AppModule } from '@/infra/app.module';
import { MongooseModule } from '@/infra/database/mongoose/mongoose.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ChatFactory } from 'test/factories/make-chat';
import { MessageFactory } from 'test/factories/make-message';
import { UserFactory } from 'test/factories/make-user';

describe('List Messages (E2E)', () => {
  let app: INestApplication;
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

    userFactory = moduleRef.get(UserFactory);
    chatFactory = moduleRef.get(ChatFactory);
    messageFactory = moduleRef.get(MessageFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /messages', async () => {
    const users = await Promise.all([
      userFactory.makeMongooseUser(),
      userFactory.makeMongooseUser(),
    ]);

    const chat = await chatFactory.makeMongooseChat({
      userIds: [users[0].id, users[1].id],
    });

    const messages = await Promise.all([
      messageFactory.makeMongooseMessage({
        chatId: chat.id,
        senderId: users[0].id,
      }),
      messageFactory.makeMongooseMessage({
        chatId: chat.id,
        senderId: users[1].id,
      }),
    ]);

    const accessToken = jwt.sign({ sub: users[0].id.toString() });

    const response = await request(app.getHttpServer())
      .get('/messages')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        chatId: chat.id,
      });

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: messages[0].id,
        }),
        expect.objectContaining({
          id: messages[1].id,
        }),
      ]),
    );
  });
});
