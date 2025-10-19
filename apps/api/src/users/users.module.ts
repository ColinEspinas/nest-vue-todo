import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { UsersRepository } from './repositories/users.repository';
import { PrismaUsersRepository } from './repositories/prisma-user.repository';

@Module({
  providers: [
    PrismaService,
    UsersService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
