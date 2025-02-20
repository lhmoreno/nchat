import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { EnvService } from '../env/env.service';
import * as jwt from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';

const tokenPayloadSchema = z.object({
  sub: z.string(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  protected config: EnvService;

  constructor(config: EnvService) {
    const publicKey = config.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      algorithms: ['RS256'],
    });

    this.config = config;
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }

  validateWsToken(token: string): UserPayload {
    try {
      const publicKey = this.config.get('JWT_PUBLIC_KEY');
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      return tokenPayloadSchema.parse(payload);
    } catch {
      throw new WsException('Unauthorized');
    }
  }
}
