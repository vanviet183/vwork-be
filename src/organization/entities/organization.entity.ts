import { Meeting } from 'src/meeting/entities/meeting.entity';
import { Project } from 'src/project/entities/project.entity';
import { User } from 'src/user/entities/user.entity';
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
  author: string;

  @Column()
  organizationName: string;

  @Column()
  description: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => User, (user) => user.organization, { cascade: true })
  users: User[];

  @OneToMany(() => Project, (project) => project.organization, {
    cascade: true,
  })
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
