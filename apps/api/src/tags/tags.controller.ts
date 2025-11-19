import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PayloadUser } from '../auth/types/payload-user.type';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';
import { CreateTagsDto } from './dtos/create-tags.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(@Req() request: Request & { user: PayloadUser }) {
    return this.tagsService.findAllByUserId(request.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request & { user: PayloadUser }) {
    const tag = await this.tagsService.findById(id, request.user.id);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  @Post()
  async create(
    @Body() body: CreateTagDto | CreateTagsDto,
    @Req() request: Request & { user: PayloadUser },
  ) {
    // Check if it's a batch creation by checking for the 'tags' property
    if ('tags' in body) {
      return this.tagsService.createMany(body.tags, request.user.id);
    }
    return this.tagsService.create(body, request.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
    @Req() request: Request & { user: PayloadUser },
  ) {
    const tag = await this.tagsService.update(id, updateTagDto, request.user.id);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @Req() request: Request & { user: PayloadUser }) {
    const tag = await this.tagsService.delete(id, request.user.id);
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }
}
