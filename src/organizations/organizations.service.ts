import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { JoinOrganizationDto } from './dto/join-organization.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    const newOrganiztion = await this.organizationRepository.create({
      ...createOrganizationDto,
    });

    return await this.organizationRepository.save(newOrganiztion);
  }

  async join(joinOrganizationDto: JoinOrganizationDto) {
    const organiztion = await this.organizationRepository.findOneBy({
      id: joinOrganizationDto.organizationId,
    });
    if (!organiztion) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepository.findOneBy({
      id: joinOrganizationDto.userId,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    organiztion.users.push(user);
    return await this.organizationRepository.save(organiztion);
  }

  async findAll() {
    return await this.organizationRepository.find();
  }

  async findOne(id: number) {
    return await this.organizationRepository.findOneBy({ id });
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
