import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Task } from './task.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {}
