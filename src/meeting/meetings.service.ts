import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Meeting } from './entities/meeting.entity';
import { Project } from 'src/project/entities/project.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Meeting)
    private meetingRepository: Repository<Meeting>,
    private readonly mailService: MailerService,
  ) {}

  async create(createMeetingDto: CreateMeetingDto) {
    const project = await this.projectRepository.findOneBy({
      id: createMeetingDto.projectId,
    });

    if (!project) {
      throw new HttpException('Dự án không tồn tại', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOneBy({
      id: createMeetingDto.userId,
    });

    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    let users = [];
    if (createMeetingDto.type === 'PROJECT') {
      const promiseAllGetListUser = createMeetingDto.listUser.map((id) =>
        this.userRepository.findOneBy({ id }),
      );
      users = await Promise.all(promiseAllGetListUser);
    }

    const newMeeting = await this.meetingRepository.create(createMeetingDto);
    newMeeting.author = `${user.firstName} ${user.lastName}`;
    newMeeting.project = project;
    newMeeting.users = users;

    newMeeting.users.push(user);

    const meeting = await this.meetingRepository.save(newMeeting);
    return { message: 'Thêm cuộc họp thành công', contents: { meeting } };
  }

  findAll() {
    return `This action returns all meetings`;
  }

  async getMeetingInfo(id: number) {
    const meeting = this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.users', 'user')
      .where('meeting.id = :id', { id })
      .getOne();

    if (!meeting) {
      throw new HttpException('Cuộc họp không tồn tại', HttpStatus.NOT_FOUND);
    }
    return meeting;
  }

  async update(id: number, updateMeetingDto: UpdateMeetingDto) {
    const promiseAllGetListUser = updateMeetingDto.listUser.map((id) =>
      this.userRepository.findOneBy({ id }),
    );

    const listUser = await Promise.all(promiseAllGetListUser);

    const user = await this.userRepository.findOneBy({
      id: updateMeetingDto.userId,
    });

    if (!user) {
      throw new HttpException('Người dùng không tồn tại', HttpStatus.NOT_FOUND);
    }

    const meeting = await this.meetingRepository
      .createQueryBuilder()
      .update(Meeting)
      .set({
        title: updateMeetingDto.title,
        startTime: updateMeetingDto.startTime,
        endTime: updateMeetingDto.endTime,
        description: updateMeetingDto.description,
        location: updateMeetingDto.location,
      })
      .where('id = :id', { id: updateMeetingDto.meetingId })
      .execute();

    const meetingUpdate = await this.meetingRepository.findOneBy({ id });
    if (!meeting) {
      throw new HttpException('Cuộc họp không tồn tại', HttpStatus.NOT_FOUND);
    }
    meetingUpdate.users = listUser;
    meetingUpdate.users.push(user);

    await this.meetingRepository.save(meetingUpdate);

    // const subject = `Cuộc họp của bạn đã được cập nhật`;
    // const message = `Bạn có một cuộc họp đã cập nhật: ${updateMeetingDto.meetingName}`;

    // for (const user of listUser) {
    //   await this.sendMail(user.email, subject, message);
    // }

    if (!meeting) {
      throw new HttpException('Cuộc họp không tồn tại', HttpStatus.NOT_FOUND);
    }

    return { message: 'Cập nhật cuộc họp thành công', contents: { meeting } };
  }

  async remove(id: number) {
    const meeting = await this.meetingRepository.findOneBy({ id });
    if (!meeting) {
      throw new HttpException('Cuộc họp không tồn tại', HttpStatus.NOT_FOUND);
    }

    await this.meetingRepository.remove(meeting);

    return { message: 'Xoá cuộc họp thành công' };
  }

  async sendMail(toVal: string, subjectVal: string, messageVal: string) {
    await this.mailService.sendMail({
      from: 'Vwork <info@vwrok.com>',
      to: toVal,
      subject: subjectVal,
      text: messageVal,
    });
  }
}
