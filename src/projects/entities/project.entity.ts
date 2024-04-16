import { Organization } from 'src/organizations/entities/organization.entity';
import { UserProject } from 'src/users/entities/user-project.entity';

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
  name: string;

  @Column()
  status: number;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  prioritize: number;

  @ManyToOne(() => Organization, (organization) => organization.projects)
  organization: Organization;

  @OneToMany(() => UserProject, (userProject) => userProject.project)
  userProjects: UserProject[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
