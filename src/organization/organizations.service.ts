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
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // create organization
    const newOrganiztion = await this.organizationRepository.create({
      ...createOrganizationDto,
    });
    const organization = await this.organizationRepository.save(newOrganiztion);

    organization.author = user.id;

    return { message: 'Tạo tổ chức thành công', organization };
  }

  // async join(joinOrganizationDto: JoinOrganizationDto) {
  //   const organiztion = await this.organizationRepository.findOneBy({
  //     id: joinOrganizationDto.organizationId,
  //   });
  //   if (!organiztion) {
  //     throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
  //   }

  //   return await this.organizationRepository.save(organiztion);
  // }

  async getAllGroupInOrganization(id: number) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['groups'],
    });

    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }

    return { listGroup: organization.groups };
  }

  async getAllUserInOrganization(id: number) {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: ['groups'],
    });

    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }

    const listUser = organization.groups.flatMap((entry) =>
      entry.users.map((user) => ({
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        role: this.getPositionUser(user.role),
        group: entry.groupName === 'COMMON' ? 'Chưa có' : entry.groupName,
      })),
    );

    return { listUser };
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
      .where('organization.id = :id', { id })
      .getOne();

    if (!organization) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }

    return { listProject: organization.projects };
  }

  async findAll() {
    return await this.organizationRepository.find();
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
    return await this.organizationRepository.delete(id);
  }
}
