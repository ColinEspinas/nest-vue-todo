import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UsersRepository } from './users.repository';
import { User } from '../entities/user.entity';
import { NewUserDTO } from '../dtos/new-user.dto';
import { Prisma } from 'generated/prisma';
import { DuplicateUserError } from '../errors/duplicate-user.error';

@Injectable()
export class PrismaUsersRepository extends UsersRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: NewUserDTO): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new DuplicateUserError();
        }
        throw e;
      }
      throw e;
    }
  }
}
