import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Group } from 'src/group/entities/group.entity';
import * as csv from 'csvtojson';
import { CreateListUserDto } from './dto/create-list-user.dto';
import { Organization } from 'src/organization/entities/organization.entity';

interface IUser {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  password?: string;
  groupName?: string;
  role: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  LIST_HEADER_OF_FILE_CSV = [
    'firstName',
    'lastName',
    'phone',
    'email',
    'password',
    'role',
  ];

  async create(createUserDto: CreateUserDto) {
    const group = await this.groupRepository.findOneBy({
      id: createUserDto.groupId,
    });

    if (!group) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    }

    const newUser = this.userRepository.create({
      ...createUserDto,
    });
    newUser.group = group;

    return await this.userRepository.save(newUser);
  }

  async createListUser(
    createListUserDto: CreateListUserDto,
    file: Express.Multer.File,
  ) {
    const listUser: IUser[] = [];

    const organiztion = await this.organizationRepository.findOne({
      where: {
        id: createListUserDto.organizationId,
      },
      relations: ['groups'],
    });

    if (!organiztion) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    }
    const group = organiztion.groups.find(
      (item) => item.groupName === 'COMMON',
    );

    await csv({
      noheader: true,
      headers: this.LIST_HEADER_OF_FILE_CSV,
      delimiter: ';',
    })
      .fromString(file.buffer.toString())
      .then((listUserObj) => {
        listUserObj = listUserObj.slice(1);

        listUserObj.map((item: IUser) => {
          const userItem = {
            firstName: item.firstName,
            lastName: item.lastName,
            phone: item.phone,
            email: item.email,
            password: item.password,
            role: item.role,
          };

          listUser.push(userItem);
        });
      });

    for (let i = 0; i < listUser.length; i++) {
      const newUser = this.userRepository.create(listUser[i]);
      newUser.group = group;

      try {
        await this.userRepository.save(newUser);
      } catch (err) {
        console.log('err', err);
        continue;
      }
    }

    return { message: 'Tạo danh sách thành viên thành công' };
  }

  findAll() {
    return this.userRepository.find();
  }

  async getUserInfo(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['group'],
    });

    return {
      ...user,
      group: user.group,
      organization: user.group.organization,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return 'test';
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
