import { Module } from '@nestjs/common';
import { TaskRequireService } from './task-require.service';
import { TaskRequireController } from './task-require.controller';

@Module({
  controllers: [TaskRequireController],
  providers: [TaskRequireService],
})
export class TaskRequireModule {}
