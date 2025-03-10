import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { AuthenticateUseCase } from '@/domain/use-cases/authenticate';
import { WrongCredentialsError } from '@/domain/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';
import { createZodDto } from 'nestjs-zod';
import {
  AuthenticateUserResponse,
  authenticateUserSchema,
} from '@nchat/dtos/user';

const bodyValidationPipe = new ZodValidationPipe(authenticateUserSchema);

class AuthenticateBodySchema extends createZodDto(authenticateUserSchema) {}

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: AuthenticateBodySchema,
  ): Promise<AuthenticateUserResponse> {
    const { email, password } = body;

    const result = await this.authenticate.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
