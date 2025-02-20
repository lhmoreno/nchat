import { AppModule } from '@/infra/app.module';
import { MongooseModule } from '@/infra/database/mongoose/mongoose.module';
import { UserDoc } from '@/infra/database/mongoose/schemas/user.schema';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import request from 'supertest';
import { UserFactory } from 'test/factories/make-user';

describe('Update Username (E2E)', () => {
  let app: INestApplication;
  let userFactory: UserFactory;
  let userModel: Model<UserDoc>;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, MongooseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    userModel = moduleRef.get('USER_MODEL');
    userFactory = moduleRef.get(UserFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[PATCH] /users/username', async () => {
    const user = await userFactory.makeMongooseUser();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .patch('/users/username')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        username: 'new-username',
      });

    expect(response.statusCode).toBe(204);

    const userOnDatabase = await userModel.findOne({
      _id: user.id.toString(),
    });

    expect(userOnDatabase?.username).toEqual('new-username');
  });
});
