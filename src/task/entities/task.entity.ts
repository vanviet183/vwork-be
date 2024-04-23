import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
import { Document } from 'src/document/entities/document.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskRequire } from 'src/task-require/entities/task-require.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  taskName: string;

  @Column()
  authorTask: number;

  @Column()
  prioritize: string;

  @Column()
  status: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column({ nullable: true })
  finishDay: string;

  @ManyToMany(() => User, (user) => user.tasks, {
    eager: true,
  })
  @JoinTable({
    name: 'user_task',
  })
  users?: User[];

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @OneToMany(() => Document, (document) => document.task)
  documents: Document[];

  @OneToMany(() => TaskRequire, (taskRequire) => taskRequire.task)
  taskRequires: TaskRequire[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
