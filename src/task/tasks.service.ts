import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';

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
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    let userResponsible = null;
    if (createTaskDto.userResponsible) {
      userResponsible = await this.userRepository.findOneBy({
        id: createTaskDto.userResponsible,
      });
    }
    const promiseAllGetListUser = createTaskDto.listUserImplement.map((id) =>
      this.userRepository.findOneBy({ id }),
    );

    const listUserImplement = await Promise.all(promiseAllGetListUser);

    const newTask = await this.taskRepository.create(createTaskDto);
    newTask.project = project;
    newTask.userResponsible = userResponsible
      ? userResponsible.id
      : createTaskDto.userResponsible;

    if (!newTask.users) {
      newTask.users = [];
    }
    newTask.users.push(...listUserImplement);
    await this.taskRepository.create(newTask);
    return await this.taskRepository.save({ ...newTask, status: 'Doing' });
  }

  findAll() {
    return `This action returns all tasks`;
  }

  async getAllTaskInProject(id: number) {
    const project = await this.projectRepository.findOneBy({
      id,
    });
    if (!project) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
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
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
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
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    return { listDocument: task.documents };
  }

  async getTaskInfo(id: number) {
    const task = this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
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
