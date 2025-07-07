// hooks/use-column-modal.ts (versão aprimorada)
'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { useCallback } from 'react';

type ModalMode = 'create' | 'edit' | null;

export function useColumnModal() {
  const [modalState, setModalState] = useQueryState(
    'column_modal',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true })
  );

  const isOpen = !!modalState;
  const mode: ModalMode = modalState.startsWith('edit:')
    ? 'edit'
    : modalState === 'create'
      ? 'create'
      : null;
  const columnId =
    mode === 'edit' ? modalState.replace('edit:', '') : undefined;

  const openCreate = useCallback(() => {
    setModalState('create');
  }, [setModalState]);

  const openEdit = useCallback(
    (id: string) => {
      setModalState(`edit:${id}`);
    },
    [setModalState]
  );

  const close = useCallback(() => {
    setModalState('');
  }, [setModalState]);

  // Função genérica para abrir modal
  const open = useCallback(
    (modalMode: 'create' | 'edit', id?: string) => {
      if (modalMode === 'create') {
        openCreate();
      } else if (modalMode === 'edit' && id) {
        openEdit(id);
      }
    },
    [openCreate, openEdit]
  );

  return {
    // Estados
    isOpen,
    mode,
    columnId,

    // Ações específicas
    openCreate,
    openEdit,
    close,

    // Ação genérica (compatibilidade)
    open,
  };
}
