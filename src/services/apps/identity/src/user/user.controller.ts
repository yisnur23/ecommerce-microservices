import { Controller, Delete, Patch, Get, Req, Body } from '@nestjs/common';
import { AuthenticatedRequest } from '@app/types/interfaces/authenticated-request.interface';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('me')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getMe(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return this.userService.findUserById(user.id);
  }

  @Patch()
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() update: UpdateUserDto,
  ) {
    const user = req.user;
    return this.userService.updateUser(user.id, update);
  }

  @Delete()
  async deleteMe(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return this.userService.deleteUser(user.id);
  }
}
