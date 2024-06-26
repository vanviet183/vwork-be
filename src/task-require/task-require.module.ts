import { Module } from '@nestjs/common';
import { TaskRequireService } from './task-require.service';
import { TaskRequireController } from './task-require.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/task/entities/task.entity';
import { TaskRequire } from './entities/task-require.entity';
import { Project } from 'src/project/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskRequire, Project])],

  controllers: [TaskRequireController],
  providers: [TaskRequireService],
})
export class TaskRequireModule {}
