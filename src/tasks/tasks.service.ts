import { Injectable, NotFoundException } from '@nestjs/common';

import { Task } from './task.entity';
import { TasksStatus } from './task-status.enum';
import { TasksRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    // @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTask(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.getTaskById(id);

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string): Promise<void> {
    const affected = await this.tasksRepository.deleteTask(id);
    if (affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(id: string, status: string): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status as TasksStatus;
    return this.tasksRepository.save(task);
  }
}
