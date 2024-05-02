import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Task } from 'src/task/entities/task.entity';
import { Meeting } from 'src/meeting/entities/meeting.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Group } from 'src/group/entities/group.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @Column({ nullable: true, default: null })
  role: string;

  @ManyToOne(() => Group, (group) => group.users)
  group: Group;

  @ManyToMany(() => Task, (task) => task.users)
  tasks: Task[];

  @ManyToMany(() => Meeting, (meeting) => meeting.users)
  meetings: Meeting[];

  @ManyToMany(() => Notification, (notification) => notification.users)
  notifications: Notification[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
