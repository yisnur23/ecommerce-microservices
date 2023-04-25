import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '@app/types/user.type';

export type JwtPayload = {
  id: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
