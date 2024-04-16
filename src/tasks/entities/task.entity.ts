import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column()
  prioritize: number;

  @Column()
  status: number;

  @Column()
  deadline: string;

  @ManyToMany(() => User, (user) => user.tasks, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
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
