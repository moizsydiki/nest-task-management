export enum TasksStatus {
  OPEN = 'OPEN',
  DONE = 'DONE',
  IN_PROGRESS = 'IN_PROGRESS',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TasksStatus;
}
