import { ListUsersUseCase } from '@/domain/use-cases/list-users';
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
@Controller('/users')
export class ListUsersController {
  constructor(private listUsers: ListUsersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() user: UserPayload): Promise<User[]> {
    const userId = user.sub;

    const result = await this.listUsers.execute({
      userId,
    });

    if (result.isLeft()) {
      throw new InternalServerErrorException();
    }

    return result.value.users.map((user) => ({
      id: user.id.toString(),
      name: user.name,
      username: user.username,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
  }
}
