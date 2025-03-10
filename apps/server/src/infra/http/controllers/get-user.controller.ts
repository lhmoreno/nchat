import { GetUserUseCase } from '@/domain/use-cases/get-user';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { User } from '@nchat/dtos/user';
import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('/me')
export class GetUserController {
  constructor(private getUser: GetUserUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload): Promise<User> {
    const userId = user.sub;

    const result = await this.getUser.execute({
      userId,
    });

    if (result.isLeft()) {
      throw new InternalServerErrorException();
    }

    return {
      id: result.value.user.id.toString(),
      name: result.value.user.name,
      username: result.value.user.username,
      createdAt: result.value.user.createdAt.toISOString(),
      updatedAt: result.value.user.updatedAt.toISOString(),
    };
  }
}
