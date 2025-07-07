// hooks/use-edit-task.modal.ts
import { useState, useCallback } from 'react';

export function useEditTaskModal() {
  const [isOpen, setIsOpen] = useState<string | false>(false);

  const open = useCallback((taskId: string) => {
    setIsOpen(taskId);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    open,
    close,
  };
}
