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
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOneBy({
      id: createProjectDto.userId,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newProject = await this.projectRepository.create(createProjectDto);
    newProject.organization = organiztion;

    return await this.projectRepository.save({
      ...newProject,
      author: `${user.firstName} ${user.lastName}`,
      status: 'Doing',
      percent: 0,
      prioritize: false,
    });
  }

  async getAllTaskInProject(id: number) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.tasks', 'task')
      .leftJoinAndSelect('task.users', 'user')
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }

    return { listTask: project.tasks };
  }

  async findAll() {
    return await this.projectRepository.find();
  }

  async getProjectInfo(id: number) {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    }
    return project;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
