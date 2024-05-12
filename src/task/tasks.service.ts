import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { TASK_STATUS } from 'src/contants/common';
import * as dayjs from 'dayjs';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const project = await this.projectRepository.findOneBy({
      id: createTaskDto.projectId,
    });

    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }

    const promiseAllGetListUser = createTaskDto.listUserImplement.map((id) =>
      this.userRepository.findOneBy({ id }),
    );

    const listUserImplement = await Promise.all(promiseAllGetListUser);

    const newTask = await this.taskRepository.create(createTaskDto);
    newTask.project = project;

    newTask.users = listUserImplement;
    newTask.status = 'None';

    const task = await this.taskRepository.save(newTask);
    return { message: 'Thêm công việc thành công', contents: { task } };
  }

  async updateStatusTask(updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOneBy({
      id: updateTaskDto.taskId,
    });

    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }
    task.status = updateTaskDto.status;
    if (updateTaskDto.status === TASK_STATUS.COMPLETED) {
      task.finishDay = dayjs().format('DD/MM/YYYY');
    }
    return await this.taskRepository.save(task);
  }

  findAll() {
    return `This action returns all tasks`;
  }

  async getAllTaskInProject(id: number) {
    const project = await this.projectRepository.findOneBy({
      id,
    });
    if (!project) {
      throw new HttpException('Tổ chức không tồn tại', HttpStatus.NOT_FOUND);
    }
    const listTask = await this.taskRepository.find({
      relations: ['project'],
    });
    const listItems = listTask.filter((item) => item.project.id === id);
    return { listTask: listItems };
  }

  async getAllTaskRequireInTask(id: number) {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.taskRequires', 'task-require')
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { listTaskRequire: task.taskRequires };
  }

  async getAllDocumentInTask(id: number) {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.documents', 'document')
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { listDocument: task.documents };
  }

  async getTaskInfo(id: number) {
    const task = this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
