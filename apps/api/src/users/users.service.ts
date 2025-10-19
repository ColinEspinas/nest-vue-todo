import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { NewUserDTO } from './dtos/new-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }

  async create(newUser: NewUserDTO): Promise<User> {
    return await this.usersRepository.create(newUser);
  }
}
