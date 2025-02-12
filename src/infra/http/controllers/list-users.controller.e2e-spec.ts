import { AppModule } from '@/infra/app.module';
import { MongooseModule } from '@/infra/database/mongoose/mongoose.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { UserFactory } from 'test/factories/make-user';

describe('List Users (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, MongooseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test('[GET] /users', async () => {
    const users = await Promise.all([
      userFactory.makeMongooseUser(),
      userFactory.makeMongooseUser(),
    ]);

    const accessToken = jwt.sign({ sub: users[0].id.toString() });

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: users[1].username,
        }),
      ]),
    );
  });
});
