import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserNotExists } from '@/domain/use-cases/errors/user-not-exists';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUsernameUseCase } from '@/domain/use-cases/update-username';
import { UserNameAlreadyExistsError } from '@/domain/use-cases/errors/username-already-exists-error';
import { updateUsernameSchema } from '@nchat/dtos/user';

const bodyValidationPipe = new ZodValidationPipe(updateUsernameSchema);

class UpdateUsernameBodySchema extends createZodDto(updateUsernameSchema) {}

@ApiBearerAuth()
@Controller('/users/username')
export class UpdateUsernameController {
  constructor(private updateUsername: UpdateUsernameUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: UpdateUsernameBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub;

    const result = await this.updateUsername.execute({
      username: body.username,
      userId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserNameAlreadyExistsError:
          throw new ConflictException(error.message);
        case UserNotExists:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
