import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
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

    const newProject = await this.projectRepository.create(createProjectDto);

    return await this.projectRepository.save({
      ...newProject,
      status: 'Doing',
      percent: 0,
      prioritize: false,
    });
  }

  async findAll() {
    return await this.projectRepository.find();
  }

  async findAllByOrganization(id: number) {
    const organiztion = await this.organizationRepository.findOneBy({
      id,
    });
    if (!organiztion) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }
    const listProject = await this.projectRepository.find({
      relations: ['organization'],
    });
    return { listProject };
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
