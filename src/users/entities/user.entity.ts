import { Organization } from 'src/organizations/entities/organization.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,

  PrimaryGeneratedColumn,
} from 'typeorm';

import { Task } from 'src/tasks/entities/task.entity';
import { Meeting } from 'src/meetings/entities/meeting.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @ManyToOne(() => Organization, (organization) => organization.users)
  organization: Organization;

  @ManyToMany(() => Task, (task) => task.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  tasks: Task[];

  @ManyToMany(() => Document, (document) => document.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  documents: Document[];

  @ManyToMany(() => Meeting, (meeting) => meeting.users, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  meetings: Meeting[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
