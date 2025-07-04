// hooks/use-confirmation.tsx
import { useState, useCallback } from 'react';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    isOpen: false,
    title: '',
    message: '',
  });

  const showConfirmation = useCallback(
    (config: Omit<ConfirmationState, 'isOpen'>) => {
      setConfirmation({
        ...config,
        isOpen: true,
      });
    },
    []
  );

  const hideConfirmation = useCallback(() => {
    setConfirmation((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleConfirm = useCallback(async () => {
    if (confirmation.onConfirm) {
      setConfirmation((prev) => ({ ...prev, loading: true }));
      try {
        await confirmation.onConfirm();
        hideConfirmation();
      } catch (error) {
        console.error('Erro na confirmação:', error);
      } finally {
        setConfirmation((prev) => ({ ...prev, loading: false }));
      }
    } else {
      hideConfirmation();
    }
  }, [confirmation.onConfirm, hideConfirmation]);

  const handleCancel = useCallback(() => {
    if (confirmation.onCancel) {
      confirmation.onCancel();
    }
    hideConfirmation();
  }, [confirmation.onCancel, hideConfirmation]);

  // Métodos de conveniência para tipos específicos
  const confirmDelete = useCallback(
    (
      title: string,
      message: string | React.ReactNode,
      onConfirm: () => void | Promise<void>
    ) => {
      showConfirmation({
        title,
        message,
        type: 'danger',
        confirmText: 'Deletar',
        cancelText: 'Cancelar',
        onConfirm,
      });
    },
    [showConfirmation]
  );

  const confirmAction = useCallback(
    (
      title: string,
      message: string | React.ReactNode,
      onConfirm: () => void | Promise<void>,
      confirmText: string = 'Confirmar'
    ) => {
      showConfirmation({
        title,
        message,
        type: 'warning',
        confirmText,
        cancelText: 'Cancelar',
        onConfirm,
      });
    },
    [showConfirmation]
  );

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    handleConfirm,
    handleCancel,
    confirmDelete,
    confirmAction,
  };
};

export default useConfirmation;
