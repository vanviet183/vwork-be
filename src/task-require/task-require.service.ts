import { Injectable } from '@nestjs/common';
import { CreateTaskRequireDto } from './dto/create-task-require.dto';
import { UpdateTaskRequireDto } from './dto/update-task-require.dto';

@Injectable()
export class TaskRequireService {
  create(createTaskRequireDto: CreateTaskRequireDto) {
    return 'This action adds a new taskRequire';
  }

  findAll() {
    return `This action returns all taskRequire`;
  }

  findOne(id: number) {
    return `This action returns a #${id} taskRequire`;
  }

  update(id: number, updateTaskRequireDto: UpdateTaskRequireDto) {
    return `This action updates a #${id} taskRequire`;
  }

  remove(id: number) {
    return `This action removes a #${id} taskRequire`;
  }
}
