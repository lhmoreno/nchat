import { Document, ObjectId, Schema } from 'mongoose';

export type ChatDoc = Document<ObjectId> & {
  userIds: [ObjectId, ObjectId];
  createdAt: Date;
};

export const ChatSchema = new Schema<ChatDoc>(
  {
    userIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      validate: {
        validator: (arr: string[]) => arr.length === 2,
        message: 'max two userIds.',
      },
      required: true,
    },
  },
  { timestamps: true },
);
