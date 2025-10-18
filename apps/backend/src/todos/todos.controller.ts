import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@GetUser() user: any, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(user.userId, createTodoDto);
  }

  @Get()
  findAll(@GetUser() user: any) {
    return this.todosService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@GetUser() user: any, @Param('id') id: string) {
    return this.todosService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(id, user.userId, updateTodoDto);
  }

  @Delete(':id')
  remove(@GetUser() user: any, @Param('id') id: string) {
    return this.todosService.remove(id, user.userId);
  }
}
