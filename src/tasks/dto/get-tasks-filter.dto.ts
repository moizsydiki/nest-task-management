import { TasksStatus } from '../task.model';

export class GetTasksFilterDto {
  search?: string;
  status?: TasksStatus;
}
