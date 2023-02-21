import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  findUserById(id: string) {
    return this.findOneBy({
      id,
    });
  }

  findUserByEmail(email: string) {
    return this.findOneBy({
      email,
    });
  }

  findUserByUsername(username: string) {
    return this.findOneBy({
      username,
    });
  }
}
