import { config } from 'dotenv';
import mongoose from 'mongoose';
import { envSchema } from '@/infra/env/env';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);

const databaseURL = env.DATABASE_URL;

let connection: mongoose.Connection;

beforeAll(async () => {
  connection = await mongoose.createConnection(databaseURL).asPromise();
});

afterAll(async () => {
  await connection.dropDatabase();
  await connection.close();
});
