import { IsEnum, IsOptional, IsString } from 'class-validator';

import { TasksStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(TasksStatus)
  status?: TasksStatus;
}
