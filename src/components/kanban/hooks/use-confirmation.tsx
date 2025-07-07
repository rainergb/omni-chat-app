import { useState, useCallback, useRef } from 'react';

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

const initialState: ConfirmationState = {
  isOpen: false,
  title: '',
  message: '',
};

export const useConfirmation = () => {
  const [confirmation, setConfirmation] =
    useState<ConfirmationState>(initialState);
  const confirmCallbackRef = useRef<(() => void | Promise<void>) | null>(null);
  const cancelCallbackRef = useRef<(() => void) | null>(null);

  const showConfirmation = useCallback(
    (config: Omit<ConfirmationState, 'isOpen' | 'loading'>) => {
      confirmCallbackRef.current = config.onConfirm || null;
      cancelCallbackRef.current = config.onCancel || null;

      setConfirmation({
        ...config,
        isOpen: true,
        loading: false,
      });
    },
    []
  );

  const hideConfirmation = useCallback(() => {
    setConfirmation(initialState);
    confirmCallbackRef.current = null;
    cancelCallbackRef.current = null;
  }, []);

  const handleConfirm = useCallback(async () => {
    const confirmCallback = confirmCallbackRef.current;

    if (confirmCallback) {
      setConfirmation((prev) => ({ ...prev, loading: true }));

      try {
        await confirmCallback();
        hideConfirmation();
      } catch (error) {
        console.error('Erro na confirmação:', error);
        setConfirmation((prev) => ({ ...prev, loading: false }));
      }
    } else {
      hideConfirmation();
    }
  }, [hideConfirmation]);

  const handleCancel = useCallback(() => {
    const cancelCallback = cancelCallbackRef.current;

    if (cancelCallback) {
      try {
        cancelCallback();
      } catch (error) {
        console.error('Erro no cancelamento:', error);
      }
    }

    hideConfirmation();
  }, [hideConfirmation]);

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
