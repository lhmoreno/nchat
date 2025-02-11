import { AppModule } from '@/infra/app.module';
import { UserDoc } from '@/infra/database/mongoose/schemas/user.schema';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as request from 'supertest';

describe('Create User (E2E)', () => {
  let app: INestApplication;
  let userModel: Model<UserDoc>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    userModel = moduleRef.get('USER_MODEL');

    await app.init();
  });

  test('[POST] /users', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
    });

    expect(response.statusCode).toBe(201);

    const userOnDatabase = await userModel.findOne({
      name: 'John Doe',
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
