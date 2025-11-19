import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { UpdateTagDto } from '../dtos/update-tag.dto';

export abstract class TagsRepository {
  abstract findAllByUserId(userId: string): Promise<Tag[]>;
  abstract findById(id: string, userId: string): Promise<Tag | null>;
  abstract create(createTagDto: CreateTagDto, userId: string): Promise<Tag>;
  abstract update(id: string, updateTagDto: UpdateTagDto, userId: string): Promise<Tag | null>;
  abstract delete(id: string, userId: string): Promise<Tag | null>;
}
