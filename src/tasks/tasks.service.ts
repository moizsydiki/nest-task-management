import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Task } from './task.entity';
import { TasksStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}
  async getTask(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: { id },
    });

    if (!found) {
      throw new NotFoundException(`The task with id: ${id} is not found`);
    }

    return found;
  }

  async createTask(CreateTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = CreateTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TasksStatus.OPEN,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`The task with id: ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    const task = await this.getTaskById(id);

    task.status = status as TasksStatus;
    await this.tasksRepository.save(task);

    return task;
  }
}
