import { Module } from '@nestjs/common';
import { UserModule } from './user/users.module';
import { TaskModule } from './task/tasks.module';
import { ProjectModule } from './project/projects.module';
import { DocumentModule } from './document/documents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingModule } from './meeting/meetings.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationModule } from './organization/organizations.module';
import { TaskRequireModule } from './task-require/task-require.module';
import { GroupModule } from './group/group.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Viet152418',
      database: 'vwork_be',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    TaskModule,
    ProjectModule,
    DocumentModule,
    MeetingModule,
    AuthModule,
    OrganizationModule,
    TaskRequireModule,
    GroupModule,
    NotificationModule,
  ],
})
export class AppModule {}
