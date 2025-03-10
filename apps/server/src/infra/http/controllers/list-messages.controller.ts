import { ListMessagesUseCase } from '@/domain/use-cases/list-messages';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { Message } from '@nchat/dtos/message';
import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('/chats/:chatId/messages')
export class ListMessagesController {
  constructor(private listMessages: ListMessagesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() message: UserPayload,
    @Param('chatId') chatId: string,
  ): Promise<Message[]> {
    const userId = message.sub;

    const result = await this.listMessages.execute({
      userId,
      chatId,
    });

    if (result.isLeft()) {
      throw new InternalServerErrorException();
    }

    return result.value.messages.map((message) => ({
      id: message.id.toString(),
      senderId: message.senderId.toString(),
      content: message.content,
      status: message.status,
      createdAt: message.createdAt.toISOString(),
    }));
  }
}
