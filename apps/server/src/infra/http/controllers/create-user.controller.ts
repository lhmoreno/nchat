import { CreateUserUseCase } from '@/domain/use-cases/create-user';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { Public } from '@/infra/auth/public';
import { UserAlreadyExistsError } from '@/domain/use-cases/errors/user-already-exists-error';
import { createUserSchema } from '@nchat/dtos/user';

const bodyValidationPipe = new ZodValidationPipe(createUserSchema);

class CreateUserBodySchema extends createZodDto(createUserSchema) {}

@Controller('/users')
@Public()
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(@Body(bodyValidationPipe) body: CreateUserBodySchema) {
    const result = await this.createUser.execute(body);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
