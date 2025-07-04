import { KanbanColumn } from '../types/kanban-column';
import { TaskStatus } from '../types/task-status';

export const createDefaultColumn = (
  id: string,
  title: string,
  position: number
): KanbanColumn => ({
  id,
  title,
  position,
  isDefault: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const defaultColumns: KanbanColumn[] = [
  createDefaultColumn('col-not-started', TaskStatus.NOT_STARTED, 1),
  createDefaultColumn('col-pending', TaskStatus.PENDING, 2),
  createDefaultColumn('col-in-progress', TaskStatus.IN_PROGRESS, 3),
  createDefaultColumn('col-waiting-task', TaskStatus.WAITING_TASK, 4),
  createDefaultColumn('col-delayed', TaskStatus.DELAYED, 5),
  createDefaultColumn('col-canceled', TaskStatus.CANCELED, 6),
  createDefaultColumn('col-completed', TaskStatus.COMPLETED, 7),
];
