import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const user = await this.userRepository.findOneBy({
      id: createOrganizationDto.userId,
    });

    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    // create organization
    const newOrganiztion = await this.organizationRepository.create({
      ...createOrganizationDto,
    });

    newOrganiztion.author = `${user.firstName} ${user.lastName}`;
    const organization = await this.organizationRepository.save(newOrganiztion);

    return { message: 'Tạo tổ chức thành công', contents: { organization } };
  }

  // async join(joinOrganizationDto: JoinOrganizationDto) {
  //   const organiztion = await this.organizationRepository.findOneBy({
  //     id: joinOrganizationDto.organizationId,
  //   });
  //   if (!organiztion) {
  //     throw new HttpException('Tổ chức không tồn tại', HttpStatus.NOT_FOUND);
  //   }

  //   return await this.organizationRepository.save(organiztion);
  // }

  async getAllUserInOrganization(id: number) {
    const organization = await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.users', 'user')
      .where('user.id != :id', { id })
      .getOne();

    if (!organization) {
      throw new HttpException('Tổ chức không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { listUser: organization.users };
  }

  getPositionUser(role: string) {
    switch (role) {
      case 'PROJECT_MANAGER':
        return 'Quản lý dự án';
      case 'CEO':
        return 'CEO';
      case 'TEAMLEAD':
        return 'Trưởng nhóm';
      case 'EMPLOYEE':
        return 'Nhân viên';
      default:
        return '';
    }
  }

  async getAllProjectInOrganization(id: number) {
    const organization = await this.organizationRepository
      .createQueryBuilder('organization')
      .leftJoinAndSelect('organization.projects', 'project')
      .leftJoinAndSelect('project.tasks', 'task')
      .leftJoinAndSelect('task.users', 'user')
      .where('organization.id = :id', { id })
      .getOne();

    if (!organization) {
      throw new HttpException('Tổ chức không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { listProject: organization.projects };
  }

  async findAll() {
    const listOrganization = await this.organizationRepository.find();
    return { listOrganization };
  }

  async getOrganizationInfo(id: number) {
    return await this.organizationRepository.findOne({
      where: { id },
      relations: ['groups'],
    });
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationRepository.update(
      { id },
      { ...updateOrganizationDto },
    );
  }

  async remove(id: number) {
    const organization = await this.organizationRepository.findOneBy({ id });
    if (!organization) {
      throw new HttpException('Tổ chức không tồn tại', HttpStatus.NOT_FOUND);
    }

    await this.organizationRepository.remove(organization);

    return { message: 'Xoá tổ chức thành công' };
  }
}
