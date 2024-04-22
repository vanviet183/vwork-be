import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
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
  organizationName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => User, (user) => user.organization)
  users?: User[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
