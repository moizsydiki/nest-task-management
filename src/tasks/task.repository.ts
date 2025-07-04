import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { TasksStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository {
  private readonly repository: Repository<Task>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = dataSource.getRepository(Task);
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.repository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        {
          search: `%${search}%`,
        },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string, user: User): Promise<Task | null> {
    return this.repository.findOne({ where: { id, user } });
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.repository.create({
      user,
      title,
      description,
      status: TasksStatus.OPEN,
    });

    return this.repository.save(task);
  }

  async deleteTask(id: string, user: User): Promise<number> {
    const result = await this.repository.delete({ id, user });
    return result.affected || 0;
  }

  async save(task: Task): Promise<Task> {
    return this.repository.save(task);
  }
}
