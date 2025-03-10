import { JwtStrategy } from '@/infra/auth/jwt.strategy';
import { Message } from '@nchat/dtos/message';
import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayConnection<Socket>, OnGatewayDisconnect<Socket>
{
  protected users: Record<string, string> = {};

  @WebSocketServer()
  server: Server;

  constructor(private jwtStrategy: JwtStrategy) {}

  handleConnection(client: Socket) {
    const authHeader = client.handshake.headers.authorization;

    if (!authHeader) {
      client.emit('error', 'Unauthorized');
      client.disconnect(true);
      return;
    }

    const authToken = authHeader.split(' ')[1];

    if (!authToken) {
      client.emit('error', 'Unauthorized');
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtStrategy.validateWsToken(authToken);

      this.users[payload.sub] = client.id;

      return {};
    } catch {
      client.emit('error', 'Unauthorized');
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = Object.entries(this.users).find(
      ([, id]) => id === client.id,
    )?.[0];

    if (userId) {
      delete this.users[userId];
    }
  }

  isOnline(userId: string) {
    return !!this.users[userId];
  }

  emitMessage(message: Message, userId: string, chatId: string) {
    const clientId = this.users[userId];

    if (!clientId) {
      return false;
    }

    const success = this.server.to(clientId).emit('message', chatId, message);

    return success;
  }

  emitMessageStatus(
    message: { id: string; chatId: string; status: 'delivered' | 'read' },
    userId: string,
  ) {
    const clientId = this.users[userId];

    if (!clientId) {
      return false;
    }

    const success = this.server.to(clientId).emit('message_status', message);

    return success;
  }
}
