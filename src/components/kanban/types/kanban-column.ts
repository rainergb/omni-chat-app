// types/kanban-column.ts
export interface KanbanColumn {
  id: string;
  title: string;
  position: number;
  color?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}
