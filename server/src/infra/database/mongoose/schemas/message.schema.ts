import { Document, ObjectId, Schema } from 'mongoose';

export type MessageDoc = Document<ObjectId> & {
  chatId: ObjectId;
  senderId: ObjectId;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date;
  updatedAt: Date;
};

export const MessageSchema = new Schema<MessageDoc>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
  },
  { timestamps: true },
);
