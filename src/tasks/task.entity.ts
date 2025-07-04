import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from 'src/auth/user.entity';
import { TasksStatus } from './task-status.enum';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  status: TasksStatus;

  @Column()
  description: string;

  @ManyToOne((_type) => User, (user) => user.task, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
