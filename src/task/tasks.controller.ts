import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Post('status')
  updateStatusTask(@Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateStatusTask(updateTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @Get('project/:id')
  getAllTaskInProject(@Param('id') id: number) {
    return this.taskService.getAllTaskInProject(id);
  }

  @Get(':id/task-requires')
  getAllTaskRequireInTask(@Param('id') id: number) {
    return this.taskService.getAllTaskRequireInTask(+id);
  }

  @Get(':id/documents')
  getAllDocumentInTask(@Param('id') id: number) {
    return this.taskService.getAllDocumentInTask(+id);
  }

  @Get(':id')
  getTaskInfo(@Param('id') id: string) {
    return this.taskService.getTaskInfo(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
