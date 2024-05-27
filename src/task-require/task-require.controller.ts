import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskRequireService } from './task-require.service';
import { CreateTaskRequireDto } from './dto/create-task-require.dto';
import { UpdateTaskRequireDto } from './dto/update-task-require.dto';
import { UpdateStatusTaskRequireDto } from './dto/update-status-task-require.dto';

@Controller('task-require')
export class TaskRequireController {
  constructor(private readonly taskRequireService: TaskRequireService) {}

  @Post('create')
  create(@Body() createTaskRequireDto: CreateTaskRequireDto) {
    return this.taskRequireService.create(createTaskRequireDto);
  }

  @Get()
  findAll() {
    return this.taskRequireService.findAll();
  }

  @Get(':id')
  getTaskRequireInfo(@Param('id') id: string) {
    return this.taskRequireService.getTaskRequireInfo(+id);
  }

  @Post('status')
  updateStatusTaskRequire(
    @Body() updateStatusTaskRequireDto: UpdateStatusTaskRequireDto,
  ) {
    return this.taskRequireService.updateStatusTaskRequire(
      updateStatusTaskRequireDto,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskRequireDto: UpdateTaskRequireDto,
  ) {
    return this.taskRequireService.update(+id, updateTaskRequireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskRequireService.remove(+id);
  }
}
