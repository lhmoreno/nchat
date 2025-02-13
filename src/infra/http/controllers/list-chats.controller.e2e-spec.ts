import { AppModule } from '@/infra/app.module';
import { MongooseModule } from '@/infra/database/mongoose/mongoose.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ChatFactory } from 'test/factories/make-chat';
import { UserFactory } from 'test/factories/make-user';

describe('List Chats (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let chatFactory: ChatFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, MongooseModule],
      providers: [UserFactory, ChatFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    chatFactory = moduleRef.get(ChatFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /chats', async () => {
    const users = await Promise.all([
      userFactory.makeMongooseUser(),
      userFactory.makeMongooseUser(),
    ]);

    const chat = await chatFactory.makeMongooseChat({
      userIds: [users[0].id, users[1].id],
    });

    const accessToken = jwt.sign({ sub: users[0].id.toString() });

    const response = await request(app.getHttpServer())
      .get('/chats')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: chat.id,
        }),
      ]),
    );
  });
});
