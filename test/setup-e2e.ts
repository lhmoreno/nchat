import { config } from 'dotenv';
import mongoose from 'mongoose';
import { envSchema } from '@/infra/env/env';

config({ path: '.env', override: true });
config({ path: '.env.test', override: true });

const env = envSchema.parse(process.env);
const databaseURL = env.DATABASE_URL;

process.env.DATABASE_URL = databaseURL;

beforeAll(async () => {
  await mongoose.connect(databaseURL);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});
