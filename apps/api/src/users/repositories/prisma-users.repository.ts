import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UsersRepository } from './users.repository';
import { User } from '../entities/user.entity';
import { NewUserDTO } from '../dtos/new-user.dto';
import { Prisma } from 'generated/prisma';
import { DuplicateUserError } from '../errors/duplicate-user.error';
import { EnrichedUser } from '../entities/enriched-user.entity';
import { SafeUser } from '../entities/safe-user.entity';

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

  async enrichUser(user: SafeUser): Promise<EnrichedUser | null> {
    const totalTasks = await this.prisma.task.count({
      where: { userId: user.id },
    });

    const completedTasks = await this.prisma.task.count({
      where: { userId: user.id, completed: true },
    });

    return new EnrichedUser(user.id, user.name, user.email, totalTasks, completedTasks);
  }
}
