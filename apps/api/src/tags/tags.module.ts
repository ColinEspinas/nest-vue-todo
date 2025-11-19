import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { TagsRepository } from './repositories/tags.repository';
import { PrismaTagsRepository } from './repositories/prisma-tags.repository';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TagsController],
  providers: [
    TagsService,
    PrismaService,
    {
      provide: TagsRepository,
      useClass: PrismaTagsRepository,
    },
  ],
  exports: [TagsService],
})
export class TagsModule {}
