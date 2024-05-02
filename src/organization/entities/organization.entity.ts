import { Group } from 'src/group/entities/group.entity';
import { Project } from 'src/project/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Organization {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  author: number;

  @Column()
  organizationName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => Group, (group) => group.organization)
  groups: Group[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
