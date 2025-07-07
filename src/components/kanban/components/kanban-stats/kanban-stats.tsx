import { useKanbanBoard } from '../../hooks/use-kanban-board';

// components/KanbanStats.tsx
export function KanbanStats() {
  const { board } = useKanbanBoard();

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div>Colunas: {board.totalColumns}</div>
      <div>Tarefas: {board.totalTasks}</div>
    </div>
  );
}
