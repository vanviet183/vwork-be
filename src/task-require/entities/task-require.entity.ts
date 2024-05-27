import { Task } from 'src/task/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class TaskRequire {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  requireContent: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  listUserImplement: string;

  @Column({ nullable: true })
  percent: string;

  @Column({ default: 'None' })
  status: string;

  @Column()
  important: boolean;

  @ManyToOne(() => Task, (task) => task.taskRequires, { onDelete: 'CASCADE' })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
