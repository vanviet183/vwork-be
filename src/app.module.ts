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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Viet152418',
      database: 'vwork_backup',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../'),
      renderPath: '/uploads',
    }),
    MailerModule.forRoot({
      // transport: {
      //   host: 'sandbox.smtp.mailtrap.io',
      //   port: 2525,
      //   auth: {
      //     user: 'cfcef0ad165e86',
      //     pass: 'd35b5ceefda529',
      //   },
      // },
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
          user: 'vanvietgg183@gmail.com',
          pass: 'jnxcilstwcbuhuvr',
        },
      },
    }),
    UserModule,
    TaskModule,
    ProjectModule,
    DocumentModule,
    MeetingModule,
    AuthModule,
    OrganizationModule,
    TaskRequireModule,
  ],
})
export class AppModule {}
