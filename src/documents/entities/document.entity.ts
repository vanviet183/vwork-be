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
export class Document {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  filename: string;

  @Column()
  filePath: number;

  @ManyToMany(() => User, (user) => user.documents, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'user_document',
  })
  users?: User[];

  @ManyToOne(() => Project, (project) => project.documents)
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
