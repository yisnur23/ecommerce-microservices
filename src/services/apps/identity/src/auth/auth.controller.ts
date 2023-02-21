import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Public } from '@app/auth/decorators/is-public.decorator';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('google/login')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    //
  }

  @Get('google/redirect')
  @Public()
  @UseGuards(GoogleAuthGuard)
  googleRedirect(@Req() req) {
    return this.authService.login(req.user);
  }
}
