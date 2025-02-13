import { ListChatsUseCase } from '@/domain/use-cases/list-chats';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('/chats')
export class ListChatsController {
  constructor(private listChats: ListChatsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@CurrentUser() chat: UserPayload) {
    const userId = chat.sub;

    const result = await this.listChats.execute({
      userId,
    });

    if (result.isLeft()) {
      throw new InternalServerErrorException();
    }

    return result.value.chats.map((chat) => ({
      id: chat.id,
      userId: chat.userIds.filter((id) => id !== userId)[0],
    }));
  }
}
