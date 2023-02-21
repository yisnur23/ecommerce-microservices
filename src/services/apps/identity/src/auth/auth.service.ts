import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticatedUser } from '@app/types/user.type';
import { Profile } from 'passport-google-oauth20';
import { UserService } from '../user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async findOrCreateUser(profile: Profile) {
    const user = await this.userService.findUserByEmail(
      profile.emails[0].value,
    );
    if (user) {
      return user;
    }
    return this.userService.createUser({
      email: profile.emails[0].value,
      username: profile.displayName,
    });
  }

  async login(user: AuthenticatedUser) {
    return {
      token: this.jwtService.sign(user),
    };
  }
}
