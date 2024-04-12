import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { DocumentsModule } from './documents/documents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingsModule } from './meetings/meetings.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Viet152418',
      database: 'vwork_be',
      entities: [User],
      synchronize: true,
    }),
    UsersModule,
    TasksModule,
    ProjectsModule,
    DocumentsModule,
    MeetingsModule,
    AuthModule,
  ],
})
export class AppModule {}
