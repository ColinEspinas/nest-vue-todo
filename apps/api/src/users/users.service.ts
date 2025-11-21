import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { NewUserDTO } from './dtos/new-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { EnrichedUser } from './entities/enriched-user.entity';
import { SafeUser } from './entities/safe-user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findById(id);
  }

  async create(newUser: NewUserDTO): Promise<User> {
    return await this.usersRepository.create(newUser);
  }

  async update(id: string, updateUser: UpdateUserDTO): Promise<User> {
    return await this.usersRepository.update(id, updateUser);
  }

  async enrichUser(user: SafeUser): Promise<EnrichedUser | null> {
    return await this.usersRepository.enrichUser(user);
  }
}
