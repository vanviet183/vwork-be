import { Module } from '@nestjs/common';
import { MeetingService } from './meetings.service';
import { MeetingController } from './meetings.controller';

@Module({
  controllers: [MeetingController],
  providers: [MeetingService],
})
export class MeetingModule {}
