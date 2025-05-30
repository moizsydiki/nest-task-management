import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { TasksStatus } from './task-status.enum';

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
}
