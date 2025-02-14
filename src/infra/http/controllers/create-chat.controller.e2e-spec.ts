import { AppModule } from '@/infra/app.module';
import { MongooseModule } from '@/infra/database/mongoose/mongoose.module';
import { ChatDoc } from '@/infra/database/mongoose/schemas/chat.schema';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import request from 'supertest';
import { ChatFactory } from 'test/factories/make-chat';
import { UserFactory } from 'test/factories/make-user';

describe('Create Chat (E2E)', () => {
  let app: INestApplication;
  let chatModel: Model<ChatDoc>;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, MongooseModule],
      providers: [UserFactory, ChatFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    chatModel = moduleRef.get('CHAT_MODEL');
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /chats', async () => {
    const users = await Promise.all([
      userFactory.makeMongooseUser(),
      userFactory.makeMongooseUser(),
    ]);

    const accessToken = jwt.sign({ sub: users[0].id.toString() });

    const response = await request(app.getHttpServer())
      .post('/chats')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        receiveId: users[1].id.toString(),
      });

    expect(response.statusCode).toBe(201);

    const chatOnDatabase = await chatModel.findOne({
      userIds: { $elemMatch: { $eq: users[0].id.toString() } },
    });

    expect(chatOnDatabase).toBeTruthy();
  });
});
