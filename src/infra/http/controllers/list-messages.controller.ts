import { ListMessagesUseCase } from '@/domain/use-cases/list-messages';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { createZodDto, ZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';

const listMessagesBodySchema = z.object({
  chatId: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(listMessagesBodySchema);

class ListMessagesBodySchema extends createZodDto(listMessagesBodySchema) {}

@ApiBearerAuth()
@Controller('/messages')
export class ListMessagesController {
  constructor(private listMessages: ListMessagesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: ListMessagesBodySchema,
    @CurrentUser() message: UserPayload,
  ) {
    const userId = message.sub;

    const result = await this.listMessages.execute({
      userId,
      chatId: body.chatId,
    });

    if (result.isLeft()) {
      throw new InternalServerErrorException();
    }

    return result.value.messages.map((message) => ({
      id: message.id.toString(),
      senderId: message.senderId.toString(),
      content: message.content,
      status: message.status,
      createdAt: message.createdAt,
    }));
  }
}
