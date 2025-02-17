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
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateMessageStatusUseCase } from '@/domain/use-cases/update-message-status';

const updateMessageStatusBodySchema = z.object({
  status: z.enum(['delivered', 'read']),
});

const bodyValidationPipe = new ZodValidationPipe(updateMessageStatusBodySchema);

class UpdateMessageStatusBodySchema extends createZodDto(
  updateMessageStatusBodySchema,
) {}

@ApiBearerAuth()
@Controller('/messages/:id/status')
export class UpdateMessageStatusController {
  constructor(private updateMessageStatus: UpdateMessageStatusUseCase) {}

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
  }
}
