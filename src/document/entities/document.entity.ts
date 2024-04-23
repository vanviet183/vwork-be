import { Task } from 'src/task/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  fileName: string;

  @Column()
  filePath: number;

  @ManyToOne(() => Task, (task) => task.documents)
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
