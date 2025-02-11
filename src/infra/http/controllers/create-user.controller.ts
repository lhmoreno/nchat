import { CreateUserUseCase } from '@/domain/use-cases/create-user';
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { createZodDto } from 'nestjs-zod';

const createUserBodySchema = z.object({
  name: z.string(),
});

// type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;
class CreateUserDto extends createZodDto(createUserBodySchema) {}

@Controller('/users')
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body: CreateUserDto) {
    const { name } = body;

    await this.createUser.execute({
      name,
    });
  }
}
