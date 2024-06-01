import { Module } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { ProjectController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/user/entities/user.entity';
import { Document } from 'src/document/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, Project, Document])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
