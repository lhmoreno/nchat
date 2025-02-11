import { ListUsersUseCase } from '@/domain/use-cases/list-users';
import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('/users')
export class ListUsersController {
  constructor(private listUsers: ListUsersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle() {
    const { users } = await this.listUsers.execute({
      userId: '67ab9503443b3fb34221ba52',
    });

    return users.map((user) => ({
      id: user.id,
      name: user.name,
    }));
  }
}
