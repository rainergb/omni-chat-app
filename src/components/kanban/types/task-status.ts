import { TaskPriority } from '../../components/TaskManager/types';

export enum TaskStatus {
  NOT_STARTED = 'NÃO INICIADA',
  PENDING = 'PENDENTE',
  IN_PROGRESS = 'ANDAMENTO',
  WAITING_TASK = 'AGUARDANDO TAREFA',
  DELAYED = 'ATRASADA',
  CANCELED = 'CANCELADA',
  COMPLETED = 'CONCLUÍDA',
}

export type Task = {
  id: string;
  title: string;
  columnId: string;
  status: TaskStatus;
  labels: string[];
  color: string;
  priority: TaskPriority;
  tags: string[];
  createdAt: string;
  selected: boolean;
  description?: string;
  assignee?: string;
  creator?: string;
  position: number;
  startDate?: string;
  endDate?: string;
  attachments?: Array<{
    id: number;
    name: string;
    size: string;
    type: string;
  }>;
};
