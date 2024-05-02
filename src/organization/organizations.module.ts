import { Module } from '@nestjs/common';
import { OrganizationService } from './organizations.service';
import { OrganizationController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Project } from 'src/project/entities/project.entity';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Organization, User, Group, Project])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
