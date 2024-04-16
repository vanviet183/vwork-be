import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Organization {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToOne(() => User)
  author: User;

  @Column()
  organizationName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  amountEmployee: number;

  @Column()
  role: string;

  @OneToMany(() => User, (user) => user.organization, {
    cascade: true,
    eager: true,
  })
  users?: User[];

  @OneToMany(() => Project, (project) => project.organization)
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
