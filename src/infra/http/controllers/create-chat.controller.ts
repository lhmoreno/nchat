import { CreateChatUseCase } from '@/domain/use-cases/create-chat';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChatAlreadyExistsError } from '@/domain/use-cases/errors/chat-already-exists-error';
import { UserAlreadyExistsError } from '@/domain/use-cases/errors/user-already-exists-error';

const createChatBodySchema = z.object({
  receiveId: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createChatBodySchema);

class CreateChatBodySchema extends createZodDto(createChatBodySchema) {}

@ApiBearerAuth()
@Controller('/chats')
export class CreateChatController {
  constructor(private createChat: CreateChatUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateChatBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.createChat.execute({
      userIds: [userId, body.receiveId],
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ChatAlreadyExistsError:
          throw new ConflictException(error.message);
        case UserAlreadyExistsError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
