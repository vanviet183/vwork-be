import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskRequireDto } from './dto/create-task-require.dto';
import { UpdateTaskRequireDto } from './dto/update-task-require.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRequire } from './entities/task-require.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { UpdateStatusTaskRequireDto } from './dto/update-status-task-require.dto';
import { TASK_STATUS } from 'src/contants/common';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class TaskRequireService {
  constructor(
    @InjectRepository(TaskRequire)
    private taskRequireRepository: Repository<TaskRequire>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private readonly mailService: MailerService,
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

    const taskRequire = await this.taskRequireRepository.save(newTaskRequire);
    // update status task
    await this.updateStatusTaskByTaskRequire(taskRequire.task.id);

    return {
      message: 'Thêm yêu cầu công việc thành công',
      contents: { taskRequire },
    };
  }

  findAll() {
    return `This action returns all taskRequire`;
  }

  getTaskRequireInfo(id: number) {
    const taskRequire = this.taskRequireRepository.findOneBy({ id });

    if (!taskRequire) {
      throw new HttpException(
        'Yêu cầu công việc không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return taskRequire;
  }

  async updateStatusTaskRequire(
    updateStatusTaskRequireDto: UpdateStatusTaskRequireDto,
  ) {
    const taskRequire = await this.taskRequireRepository
      .createQueryBuilder('task-require')
      .leftJoinAndSelect('task-require.task', 'task')
      .where('task-require.id = :id', {
        id: updateStatusTaskRequireDto.taskRequireId,
      })
      .getOne();

    if (!taskRequire) {
      throw new HttpException(
        'Yêu cầu công việc không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    taskRequire.status = updateStatusTaskRequireDto.status;

    try {
      await this.taskRequireRepository.save(taskRequire);
      // update status task
      await this.updateStatusTaskByTaskRequire(taskRequire.task.id);
    } catch (error) {
      throw new Error(error.message);
    }

    return {
      message: 'Cập nhật trạng thái yêu cầu công việc thành công',
      contents: { taskRequire },
    };
  }

  async update(id: number, updateTaskRequireDto: UpdateTaskRequireDto) {
    const taskRequire = await this.taskRequireRepository
      .createQueryBuilder()
      .update(TaskRequire)
      .set({
        requireContent: updateTaskRequireDto.requireContent,
        startDate: updateTaskRequireDto.startDate,
        endDate: updateTaskRequireDto.endDate,
        listUserImplement: updateTaskRequireDto.listUserImplement,
        important: updateTaskRequireDto.important,
      })
      .where('id = :id', { id: updateTaskRequireDto.taskRequireId })
      .execute();

    if (!taskRequire) {
      throw new HttpException(
        'Yêu cầu công việc không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    const taskRequireUpdate = await this.taskRequireRepository
      .createQueryBuilder('task-require')
      .leftJoinAndSelect('task-require.task', 'task')
      .leftJoinAndSelect('task.users', 'user')
      .where('task-require.id = :id', { id })
      .getOne();

    const subject = `Công việc ${taskRequireUpdate.task.taskName} của bạn đã được cập nhật`;
    const message = `Bạn có một công việc đã cập nhật yêu cầu: ${updateTaskRequireDto.requireContent}`;

    const listUser = taskRequireUpdate.task.users;
    for (const user of listUser) {
      await this.sendMail(user.email, subject, message);
    }

    return {
      message: 'Cập nhật yêu cầu công việc thành công',
      contents: { taskRequire },
    };
  }

  async remove(id: number) {
    const taskRequire = await this.taskRequireRepository.findOneBy({ id });

    if (!taskRequire) {
      throw new HttpException(
        'Yêu cầu công việc không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.taskRequireRepository.remove(taskRequire);

    return { message: 'Xoá yêu cầu công việc thành công' };
  }

  async sendMail(toVal: string, subjectVal: string, messageVal: string) {
    await this.mailService.sendMail({
      from: 'Vwork <info@vwrok.com>',
      to: toVal,
      subject: subjectVal,
      text: messageVal,
    });
  }

  async updateStatusTaskByTaskRequire(id: number) {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.taskRequires', 'task-require')
      .where('task.id = :id', { id })
      .getOne();

    if (!task) {
      throw new HttpException('Công việc không tồn tại', HttpStatus.NOT_FOUND);
    }

    const listTaskRequireInTasks = task.taskRequires;
    const listTaskRequireCompleted = listTaskRequireInTasks.filter(
      (taskRequire) => taskRequire.status === TASK_STATUS.COMPLETED,
    );
    const percent =
      (listTaskRequireCompleted.length / listTaskRequireInTasks.length) * 100;

    try {
      await this.taskRepository
        .createQueryBuilder()
        .update(Task)
        .set({
          progress: Math.round(percent * 100) / 100,
          status: percent === 100 ? 'Wait' : 'Doing',
        })
        .where('id = :id', { id: task.id })
        .execute();

      await this.updateStatusProjectByTask(task.project.id);
    } catch (error) {
      throw new Error(error.message);
    }
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
