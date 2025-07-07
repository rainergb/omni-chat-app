import { useColumnModal } from '../../hooks/use-column-modal';
import { useKanbanBoard } from '../../hooks/use-kanban-board';

// components/QuickActions.tsx
export function QuickActions() {
  const kanbanBoard = useKanbanBoard();
  const { openCreate } = useColumnModal();

  const handleResetBoard = () => {
    kanbanBoard.columns.resetToDefaults();
  };

  return (
    <div>
      <button onClick={openCreate}>Adicionar Coluna</button>
      <button onClick={handleResetBoard}>Reset para Padrão</button>
    </div>
  );
}
