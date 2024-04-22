import { Meeting } from 'src/meetings/entities/meeting.entity';
import { Document } from 'src/documents/entities/document.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Task } from 'src/tasks/entities/task.entity';

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

  @ManyToOne(() => Organization, (organization) => organization.projects)
  organization: Organization;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @OneToMany(() => Document, (document) => document.project)
  documents: Document[];

  @OneToMany(() => Meeting, (meeting) => meeting.project)
  meetings: Meeting[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
