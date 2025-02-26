import { CreateMessageUseCase } from '@/domain/use-cases/create-message';
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ApiBearerAuth } from '@nestjs/swagger';
import { EventsGateway } from '@/infra/socket/events/events.gateway';

const createMessageBodySchema = z.object({
  chatId: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createMessageBodySchema);

class CreateMessageBodySchema extends createZodDto(createMessageBodySchema) {}

@ApiBearerAuth()
@Controller('/messages')
export class CreateMessageController {
  constructor(
    private createMessage: CreateMessageUseCase,
    private eventsGateway: EventsGateway,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateMessageBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.createMessage.execute({
      chatId: body.chatId,
      content: body.content,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new ForbiddenException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    this.eventsGateway.emitMessage(
      {
        id: result.value.message.id.toString(),
        content: result.value.message.content,
        createdAt: result.value.message.createdAt,
        chatId: result.value.message.chatId.toString(),
        senderId: userId,
      },
      result.value.receiveId,
    );

    return {
      id: result.value.message.id.toString(),
      content: result.value.message.content,
      createdAt: result.value.message.createdAt,
      chatId: result.value.message.chatId.toString(),
      status: result.value.message.status,
    };
  }
}
