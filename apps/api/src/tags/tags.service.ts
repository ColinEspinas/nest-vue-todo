import { Injectable } from '@nestjs/common';
import { TagsRepository } from './repositories/tags.repository';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly tagsRepository: TagsRepository) {}

  async findAllByUserId(userId: string): Promise<Tag[]> {
    return this.tagsRepository.findAllByUserId(userId);
  }

  async findById(id: string, userId: string): Promise<Tag | null> {
    return this.tagsRepository.findById(id, userId);
  }

  async create(createTagDto: CreateTagDto, userId: string): Promise<Tag> {
    return this.tagsRepository.create(createTagDto, userId);
  }

  async createMany(createTagDtos: CreateTagDto[], userId: string): Promise<Tag[]> {
    const tags: Tag[] = [];
    for (const dto of createTagDtos) {
      const tag = await this.tagsRepository.create(dto, userId);
      tags.push(tag);
    }
    return tags;
  }

  async update(id: string, updateTagDto: UpdateTagDto, userId: string): Promise<Tag | null> {
    return this.tagsRepository.update(id, updateTagDto, userId);
  }

  async delete(id: string, userId: string): Promise<Tag | null> {
    return this.tagsRepository.delete(id, userId);
  }
}
