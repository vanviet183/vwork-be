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
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const project = await this.projectRepository.findOneBy({
      id: createTaskDto.projectId,
    });

    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }

    let listUserImplement = [];
    if (createTaskDto.listUserImplement) {
      const promiseAllGetListUser = createTaskDto.listUserImplement.map((id) =>
        this.userRepository.findOneBy({ id }),
      );

      listUserImplement = await Promise.all(promiseAllGetListUser);
    }

    const newTask = await this.taskRepository.create(createTaskDto);
    newTask.project = project;

    newTask.users = listUserImplement;

    const task = await this.taskRepository.save(newTask);
    const subject = `Bạn có một công việc mới trong dự án ${project.projectName}`;
    const message = `Bạn có một công việc mới: ${createTaskDto.taskName}`;

    for (const user of listUserImplement) {
      await this.sendMail(user.email, subject, message);
    }

    return { message: 'Thêm công việc thành công', contents: { task } };
  }

  async updateStatusTask(updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .where('task.id = :id', { id: updateTaskDto.taskId })
      .getOne();

    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }
    task.status = updateTaskDto.status;
    if (updateTaskDto.status === TASK_STATUS.COMPLETED) {
      task.finishDay = dayjs().format('YYYY/MM/DD');
      task.progress = 100;
    } else if (updateTaskDto.status === TASK_STATUS.WAIT_ACCEPT) {
      task.progress = 50;
    } else if (updateTaskDto.status === TASK_STATUS.DOING) {
      task.progress = 10;
    }
    await this.taskRepository.save(task);

    if (updateTaskDto.status === TASK_STATUS.COMPLETED) {
      await this.updateStatusProjectByTask(task.project.id);
    }
    return {
      message: 'Cập nhật trạng thái công việc thành công',
      contents: { task },
    };
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
    const task = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'user')
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const promiseAllGetListUser = updateTaskDto.listUserImplement.map((id) =>
      this.userRepository.findOneBy({ id }),
    );

    const listUserImplement = await Promise.all(promiseAllGetListUser);

    const task = await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({
        taskName: updateTaskDto.taskName,
        phase: updateTaskDto.phase,
        userResponsible: updateTaskDto.userResponsible,
        prioritize: updateTaskDto.prioritize,
        startDate: updateTaskDto.startDate,
        endDate: updateTaskDto.endDate,
      })
      .where('id = :id', { id: updateTaskDto.taskId })
      .execute();

    const taskUpdate = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }
    taskUpdate.users = listUserImplement;

    await this.taskRepository.save(taskUpdate);

    const subject = `Công việc của bạn đã được cập nhật`;
    const message = `Bạn có một công việc đã cập nhật: ${updateTaskDto.taskName}`;

    for (const user of listUserImplement) {
      await this.sendMail(user.email, subject, message);
    }

    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { message: 'Cập nhật công việc thành công', contents: { task } };
  }

  async remove(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }

    await this.taskRepository.remove(task);

    return { message: 'Xoá công việc thành công' };
  }

  async sendMail(toVal: string, subjectVal: string, messageVal: string) {
    await this.mailService.sendMail({
      from: 'Vwork <info@vwrok.com>',
      to: toVal,
      subject: subjectVal,
      text: messageVal,
    });
  }

  async updateStatusProjectByTask(id: number) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'task')
      .where('project.id = :id', { id })
      .getOne();

    const listTaskInProject = project.tasks;
    const listTaskCompleted = listTaskInProject.filter(
      (task) => task.status === TASK_STATUS.COMPLETED,
    );
    const percent = (listTaskCompleted.length / listTaskInProject.length) * 100;

    await this.projectRepository
      .createQueryBuilder()
      .update(Project)
      .set({
        percent: Math.round(percent * 100) / 100,
      })
      .where('id = :id', { id: project.id })
      .execute();
  }
}
