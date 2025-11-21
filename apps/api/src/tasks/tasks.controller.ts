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
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { TasksService } from './tasks.service';
import { Query } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { FindTasksQueryDto } from './dtos/find-tasks-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PayloadUser } from '../auth/types/payload-user.type';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Req() request: Request & { user: PayloadUser },
    @Query(new ValidationPipe({ transform: true })) query: FindTasksQueryDto,
  ) {
    return this.tasksService.findAllByUserId(
      request.user.id,
      query.limit,
      query.offset,
      query.order,
      query.tagId,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: Request & { user: PayloadUser }) {
    return this.tasksService.findById(id, request.user.id);
  }

  @Post()
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @Req() request: Request & { user: PayloadUser },
  ) {
    return this.tasksService.create(createTaskDto, request.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
    @Req() request: Request & { user: PayloadUser },
  ) {
    return this.tasksService.update(id, updateTaskDto, request.user.id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() request: Request & { user: PayloadUser }) {
    return this.tasksService.delete(id, request.user.id);
  }
}
