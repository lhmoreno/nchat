import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateMessageStatusUseCase } from '@/domain/use-cases/update-message-status';
import { EventsGateway } from '@/infra/socket/events/events.gateway';
import { updateMessageStatusSchema } from '@nchat/dtos/message';

const bodyValidationPipe = new ZodValidationPipe(updateMessageStatusSchema);

class UpdateMessageStatusBodySchema extends createZodDto(
  updateMessageStatusSchema,
) {}

@ApiBearerAuth()
@Controller('/messages/:id/status')
export class UpdateMessageStatusController {
  constructor(
    private updateMessageStatus: UpdateMessageStatusUseCase,
    private eventsGateway: EventsGateway,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateMessageStatusBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') messageId: string,
  ) {
    const userId = user.sub;

    const result = await this.updateMessageStatus.execute({
      messageId,
      userId,
      status: body.status,
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

    this.eventsGateway.emitMessageStatus(
      {
        id: result.value.message.id.toString(),
        status: result.value.message.status as 'delivered' | 'read',
        chatId: result.value.message.chatId.toString(),
      },
      result.value.senderId,
    );
  }
}
