import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { AuthenticatedUser } from '@app/types/user.type';

export type JwtPayload = {
  id: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService, configService: ConfigService) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.userService.findUserById(payload.id);

    if (!user) throw new UnauthorizedException('login required');

    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
