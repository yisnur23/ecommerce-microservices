import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto, UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async userNameExists(username: string) {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) return false;
    return user.username === username;
  }

  async findUserById(id: string) {
    const user = this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    return user;
  }

  findUserByEmail(email: string) {
    const user = this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`user with email ${email} not found`);
    }
    return user;
  }

  async createUser(user: UserDto) {
    return this.userRepository.save(user);
  }

  async updateUser(id: string, update: UpdateUserDto) {
    const user = await this.findUserById(id);

    if (
      user.username !== update.username &&
      (await this.userNameExists(update.username))
    ) {
      throw new ConflictException(`username ${update.username} already exists`);
    }

    return this.userRepository.save({ ...user, ...update });
  }

  async deleteUser(id: string) {
    const user = await this.findUserById(id);
    return this.userRepository.remove(user);
  }
}
