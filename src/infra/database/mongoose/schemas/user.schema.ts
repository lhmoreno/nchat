import { UserProps } from '@/domain/entities/user';
import { Document, Schema } from 'mongoose';

export type UserDoc = Document<string> & UserProps;

export const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);
