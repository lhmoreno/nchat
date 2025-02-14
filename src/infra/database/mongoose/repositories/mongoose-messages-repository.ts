import { Inject, Injectable } from '@nestjs/common';
import { MessagesRepository } from '@/domain/repositories/messages-repository';
import { Message } from '@/domain/entities/message';
import { MongooseMessageMapper } from '../mappers/mongoose-message-mapper';
import { Model } from 'mongoose';
import { MessageDoc } from '../schemas/message.schema';

@Injectable()
export class MongooseMessagesRepository implements MessagesRepository {
  constructor(
    @Inject('MESSAGE_MODEL')
    private messageModel: Model<MessageDoc>,
  ) {}

  async findManyByChatId(chatId: string): Promise<Message[]> {
    const messages = await this.messageModel.find({
      chatId,
    });

    return messages.map((message) => MongooseMessageMapper.toDomain(message));
  }

  async findById(id: string): Promise<Message | null> {
    const message = await this.messageModel.findOne({
      _id: id,
    });

    if (!message) {
      return null;
    }

    return MongooseMessageMapper.toDomain(message);
  }

  async create(message: Message): Promise<void> {
    await this.messageModel.create({
      chatId: message.chatId,
      senderId: message.senderId,
      content: message.content,
      status: message.status,
      updatedAt: message.updatedAt,
      createdAt: message.createdAt,
    });
  }

  async save(message: Message): Promise<void> {
    const data = MongooseMessageMapper.toMongoose(message);

    await this.messageModel.updateOne(
      {
        _id: message.id.toString(),
      },
      data,
    );
  }
}
