import { Project } from 'src/projects/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Document } from 'src/documents/entities/document.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';

@Entity()
export class UserProject {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.userProjects)
  user: User;

  @ManyToOne(() => Project, (project) => project.userProjects)
  project: Project;

  @ManyToMany(() => Task, (task) => task.userProjects, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  tasks: Task[];

  @ManyToMany(() => Document, (document) => document.userProjects, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  documents: Document[];

  @ManyToMany(() => Meeting, (meeting) => meeting.userProjects, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  meetings: Meeting[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
