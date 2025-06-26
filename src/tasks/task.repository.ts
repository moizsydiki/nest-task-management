import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Task } from './task.entity';
import { TasksStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository {
  private readonly repository: Repository<Task>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = dataSource.getRepository(Task);
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.repository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string): Promise<Task | null> {
    return this.repository.findOne({ where: { id } });
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.repository.create({
      title,
      description,
      status: TasksStatus.OPEN,
    });

    return this.repository.save(task);
  }

  async deleteTask(id: string): Promise<number> {
    const result = await this.repository.delete(id);
    return result.affected || 0;
  }

  async save(task: Task): Promise<Task> {
    return this.repository.save(task);
  }
}
