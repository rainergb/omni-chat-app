import { Task } from './task-status';

export type TasksState = {
  [columnId: string]: Task[];
};
