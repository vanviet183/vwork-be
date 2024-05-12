import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Meeting } from './entities/meeting.entity';
import { Project } from 'src/project/entities/project.entity';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
  ) {}

  async create(createMeetingDto: CreateMeetingDto) {
    const project = await this.projectRepository.findOneBy({
      id: createMeetingDto.projectId,
    });

    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }

    const promiseAllGetListUser = createMeetingDto.listUser.map((id) =>
      this.userRepository.findOneBy({ id }),
    );

    const users = await Promise.all(promiseAllGetListUser);

    const newMeeting = await this.meetingRepository.create(createMeetingDto);
    newMeeting.project = project;
    newMeeting.users = users;

    const meeting = await this.meetingRepository.save(newMeeting);
    return { message: 'Thêm cuộc họp thành công', contents: { meeting } };
  }

  findAll() {
    return `This action returns all meetings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meeting`;
  }

  update(id: number, updateMeetingDto: UpdateMeetingDto) {
    return `This action updates a #${id} meeting`;
  }

  remove(id: number) {
    return `This action removes a #${id} meeting`;
  }
}
