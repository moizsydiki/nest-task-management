import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TasksStatus } from '../task.model';

export class GetTasksFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(TasksStatus)
  status?: TasksStatus;
}
