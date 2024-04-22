import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: true })
  parentTaskId: number;

  @ManyToOne(() => Task, (task) => task.id)
  @JoinColumn({ name: 'parentTaskId' })
  parentTask?: Task;

  @Column()
  taskName: string;

  @Column()
  prioritize: boolean;

  @Column()
  status: string;

  @Column()
  startDate: string;

  @Column({ nullable: true })
  finishDay: string;

  @Column()
  endDate: string;

  @ManyToMany(() => User, (user) => user.tasks, {
    eager: true,
  })
  @JoinTable({
    name: 'user_task',
  })
  users?: User[];

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
