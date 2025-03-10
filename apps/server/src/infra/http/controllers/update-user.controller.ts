import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { UpdateUserUseCase } from '@/domain/use-cases/update-user';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserNotExists } from '@/domain/use-cases/errors/user-not-exists';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ApiBearerAuth } from '@nestjs/swagger';
import { updateUserSchema } from '@nchat/dtos/user';

const bodyValidationPipe = new ZodValidationPipe(updateUserSchema);

class UpdateUserBodySchema extends createZodDto(updateUserSchema) {}

@ApiBearerAuth()
@Controller('/users')
export class UpdateUserController {
  constructor(private updateUser: UpdateUserUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateUserBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.updateUser.execute({
      name: body.name,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserNotExists:
          throw new NotFoundException(error.message);
        case NotAllowedError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
