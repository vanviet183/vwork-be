import { Organization } from 'src/organizations/entities/organization.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserProject } from './user-project.entity';

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

  @OneToMany(() => UserProject, (userProject) => userProject.user)
  userProjects: UserProject[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
