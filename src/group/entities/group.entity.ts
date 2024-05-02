import { Organization } from 'src/organization/entities/organization.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  teamlead: number;

  @Column()
  groupName: string;

  @ManyToOne(() => Organization, (organization) => organization.groups, {
    eager: true,
  })
  organization: Organization;

  @OneToMany(() => User, (user) => user.group, { eager: true })
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
