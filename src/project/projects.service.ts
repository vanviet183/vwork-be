import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const organiztion = await this.organizationRepository.findOneBy({
      id: createProjectDto.organizationId,
    });

    if (!organiztion) {
      throw new HttpException('Tổ chức không tồn tại', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOneBy({
      id: createProjectDto.userId,
    });

    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    const newProject = await this.projectRepository.create(createProjectDto);
    newProject.organization = organiztion;

    const project = await this.projectRepository.save({
      ...newProject,
      author: `${user.firstName} ${user.lastName}`,
      status: 'Doing',
      percent: 0,
      prioritize: false,
    });

    return { message: 'Tạo dự án thành công', contents: { project } };
  }

  async getAllTaskInProject(id: number) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'task')
      .leftJoinAndSelect('task.users', 'user')
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { listTask: project.tasks };
  }

  async getAllDocumentInProject(id: number) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'task')
      .leftJoinAndSelect('task.documents', 'document')
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }

    const listDocument = [];
    project.tasks.flatMap((item) => {
      listDocument.push(item.documents);
    });

    return { listDocument: listDocument.flat() };
  }

  async getAllMeetingInProject(id: number) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.meetings', 'meeting')
      .leftJoinAndSelect('meeting.users', 'user')
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { listMeeting: project.meetings };
  }

  async findAll() {
    return await this.projectRepository.find();
  }

  async getProjectInfo(id: number) {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectRepository
      .createQueryBuilder()
      .update(Project)
      .set({
        projectName: updateProjectDto.projectName,
        description: updateProjectDto.description,
        startDate: updateProjectDto.startDate,
        endDate: updateProjectDto.endDate,
      })
      .where('id = :id', { id: updateProjectDto.projectId })
      .execute();

    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { message: 'Cập nhật dự án thành công', contents: { project } };
  }

  async remove(id: number) {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }

    await this.projectRepository.remove(project);

    return { message: 'Xoá dự án thành công' };
  }
}
