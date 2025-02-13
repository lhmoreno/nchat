import { CreateUserUseCase } from '@/domain/use-cases/create-user';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';
import { Public } from '@/infra/auth/public';
import { UserAlreadyExistsError } from '@/domain/use-cases/errors/user-already-exists-error';

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createUserBodySchema);

class CreateUserBodySchema extends createZodDto(createUserBodySchema) {}

@Controller('/users')
@Public()
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
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
