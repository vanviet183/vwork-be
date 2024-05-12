import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskRequireDto } from './dto/create-task-require.dto';
import { UpdateTaskRequireDto } from './dto/update-task-require.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRequire } from './entities/task-require.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';

@Injectable()
export class TaskRequireService {
  constructor(
    @InjectRepository(TaskRequire)
    private taskRequireRepository: Repository<TaskRequire>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskRequireDto: CreateTaskRequireDto) {
    const task = await this.taskRepository.findOneBy({
      id: createTaskRequireDto.taskId,
    });

    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }

    const newTaskRequire =
      await this.taskRequireRepository.create(createTaskRequireDto);

    newTaskRequire.task = task;

    return this.taskRequireRepository.save(newTaskRequire);
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
