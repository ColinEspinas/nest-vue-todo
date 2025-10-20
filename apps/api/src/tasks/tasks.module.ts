import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { PrismaTasksRepository } from './repositories/prisma-tasks.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    PrismaService,
    {
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
    },
  ],
  exports: [TasksService],
})
export class TasksModule {}
