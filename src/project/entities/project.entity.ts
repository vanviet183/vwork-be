import { Meeting } from 'src/meeting/entities/meeting.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { Task } from 'src/task/entities/task.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  projectName: string;

  @Column()
  author: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @Column()
  percent: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  prioritize: boolean;

  @ManyToOne(() => Organization, (organization) => organization.projects, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @OneToMany(() => Task, (task) => task.project, { eager: true, cascade: true })
  tasks: Task[];

  @OneToMany(() => Meeting, (meeting) => meeting.project)
  meetings: Meeting[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
