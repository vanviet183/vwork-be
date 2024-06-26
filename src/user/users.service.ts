import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as csv from 'csvtojson';
import { CreateListUserDto } from './dto/create-list-user.dto';
import { Organization } from 'src/organization/entities/organization.entity';
import * as bcrypt from 'bcrypt';
import { ROLE } from 'src/contants/common';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

interface IUser {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  password: string;
  sector: string;
  role: string;
  organizationId?: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  LIST_HEADER_OF_FILE_CSV = [
    'firstName',
    'lastName',
    'phone',
    'email',
    'password',
    'sector',
    'role',
    'organizationId',
  ];

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await this.hashPassword(createUserDto.password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
      avatar: 'http://localhost:3005/uploads/avatars/no-avatar.jpeg',
    });

    const user = await this.userRepository.save(newUser);
    return { message: 'Thêm người dùng thành công', contents: { user } };
  }

  async createAdmin(email: string, password: string, firstName: string) {
    const hashPassword = await this.hashPassword(password);

    const newAdmin = this.userRepository.create({
      email,
      password: hashPassword,
      firstName,
      avatar: 'http://localhost:3005/uploads/avatars/no-avatar.jpeg',
      role: ROLE.ADMIN,
    });

    return await this.userRepository.save(newAdmin);
  }

  async createListUser(
    createListUserDto: CreateListUserDto,
    file: Express.Multer.File,
  ) {
    const listUser: IUser[] = [];

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
            sector: item.sector,
            role: item.role,
            organizationId: item.organizationId,
          };

          listUser.push(userItem);
        });
      });

    let isError = false;
    for (let i = 0; i < listUser.length; i++) {
      const hashPassword = await this.hashPassword(listUser[i].password);

      const newUser = this.userRepository.create({
        ...listUser[i],
        password: hashPassword,
        avatar: 'http://localhost:3005/uploads/avatars/no-avatar.jpeg',
      });

      const organiztion = await this.organizationRepository.findOneBy({
        id: listUser[i].organizationId,
      });
      if (organiztion) {
        newUser.organization = organiztion;
      }

      try {
        await this.userRepository.save(newUser);
      } catch (err) {
        isError = true;
        console.log('err', err);
        continue;
      }
    }
    if (isError) {
      throw new HttpException(
        'Thêm danh sách người dùng thất bại',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { message: 'Thêm danh sách người dùng thành công' };
  }

  async findAll() {
    const listUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .where('user.role != :role', { role: 'ADMIN' })
      .getMany();

    return { listUser };
  }

  async count() {
    const listUser = await this.userRepository.find();
    return listUser.length;
  }

  async getUserInfo(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.organization', 'organization')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new HttpException(
        'Người dùng không tồn tại',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }

  async getAllProjectsUserJoin(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tasks', 'task')
      .leftJoinAndSelect('task.project', 'project')
      .where('user.id = :id', { id })
      .getOne();

    const projectMap = {};
    user.tasks.forEach((item) => {
      if (!projectMap[item.project.id]) {
        projectMap[item.project.id] = item.project;
      }
    });

    return {
      listProject: Object.values(projectMap),
    };
  }

  async getAdminInfo(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return {
      ...user,
    };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let organization;
    if (updateUserDto.organizationId) {
      organization = await this.organizationRepository.findOneBy({
        id: updateUserDto.organizationId,
      });
      if (!organization) {
        throw new HttpException('Tổ chức không tồn tại', HttpStatus.NOT_FOUND);
      }
    }

    const user = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        phone: updateUserDto.phone,
        email: updateUserDto.email,
        password: updateUserDto.password,
        sector: updateUserDto.sector,
        role: updateUserDto.role,
        organization: organization,
      })
      .where('id = :id', { id })
      .execute();

    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { message: 'Cập nhật thông tin thành công', contents: { user } };
  }

  async updateUserInfo(updateUserInfoDto: UpdateUserInfoDto) {
    const user = await this.userRepository.findOneBy({
      id: updateUserInfoDto.userId,
    });

    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    if (updateUserInfoDto.firstName) {
      user.firstName = updateUserInfoDto.firstName;
    }
    if (updateUserInfoDto.lastName) {
      user.lastName = updateUserInfoDto.lastName;
    }
    if (updateUserInfoDto.birthday) {
      user.birthday = updateUserInfoDto.birthday;
    }
    if (updateUserInfoDto.phone) {
      user.phone = updateUserInfoDto.phone;
    }

    await this.userRepository.save(user);

    return { message: 'Cập nhật thông tin thành công', contents: { user } };
  }

  async updatePasswordUser(updatePasswordUserDto: UpdatePasswordUserDto) {
    const user = await this.userRepository.findOneBy({
      id: updatePasswordUserDto.userId,
    });

    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    if (updatePasswordUserDto.oldPassword) {
      const checkPass = bcrypt.compareSync(
        updatePasswordUserDto.oldPassword,
        user.password,
      );
      if (!checkPass) {
        throw new HttpException('Mật khẩu không đúng', HttpStatus.UNAUTHORIZED);
      }
    }

    const hashPassword = await this.hashPassword(
      updatePasswordUserDto.newPassword,
    );

    user.password = hashPassword;
    await this.userRepository.save(user);

    return { message: 'Cập nhật mật khẩu thành công', contents: { user } };
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.remove(user);

    return { message: 'Xoá người dùng thành công' };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
