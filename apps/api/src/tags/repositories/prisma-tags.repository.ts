import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TagsRepository } from './tags.repository';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { UpdateTagDto } from '../dtos/update-tag.dto';

@Injectable()
export class PrismaTagsRepository extends TagsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAllByUserId(userId: string): Promise<Tag[]> {
    const tags = await this.prisma.tag.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    return tags as Tag[];
  }

  async findById(id: string, userId: string): Promise<Tag | null> {
    const tag = await this.prisma.tag.findFirst({
      where: { id, userId },
    });
    return tag as Tag | null;
  }

  async create(createTagDto: CreateTagDto, userId: string): Promise<Tag> {
    const tag = await this.prisma.tag.create({
      data: {
        ...createTagDto,
        userId,
      },
    });
    return tag as Tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto, userId: string): Promise<Tag | null> {
    try {
      const tag = await this.prisma.tag.update({
        where: { id, userId },
        data: updateTagDto,
      });
      return tag as Tag;
    } catch {
      return null;
    }
  }

  async delete(id: string, userId: string): Promise<Tag | null> {
    try {
      const tag = await this.prisma.tag.delete({
        where: { id, userId },
      });
      return tag as Tag;
    } catch {
      return null;
    }
  }
}
