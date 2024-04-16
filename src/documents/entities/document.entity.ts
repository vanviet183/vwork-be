import { UserProject } from 'src/users/entities/user-project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => UserProject, (userProject) => userProject.documents, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'user_project_document',
  })
  userProjects?: UserProject[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
