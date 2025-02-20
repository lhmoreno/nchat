import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { JwtStrategy } from '@/infra/auth/jwt.strategy';
import { EnvService } from '@/infra/env/env.service';

@Module({
  providers: [EventsGateway, JwtStrategy, EnvService],
  exports: [EventsGateway],
})
export class EventsModule {}
