// components/ui/confirmation-modal.tsx
import React from 'react';
import { Modal, Button } from 'antd';
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  WarningOutlined,
} from '@ant-design/icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  loading?: boolean;
  icon?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false,
  icon,
}) => {
  const getIcon = () => {
    if (icon) return icon;

    switch (type) {
      case 'danger':
        return <DeleteOutlined style={{ color: '#ff4d4f', fontSize: 22 }} />;
      case 'warning':
        return <WarningOutlined style={{ color: '#faad14', fontSize: 22 }} />;
      default:
        return (
          <ExclamationCircleOutlined
            style={{ color: '#1890ff', fontSize: 22 }}
          />
        );
    }
  };

  const getConfirmButtonProps = () => {
    switch (type) {
      case 'danger':
        return { type: 'primary' as const, danger: true };
      case 'warning':
        return { type: 'primary' as const };
      default:
        return { type: 'primary' as const };
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {getIcon()}
          <span>{title}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>,
        <Button
          key="confirm"
          {...getConfirmButtonProps()}
          loading={loading}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>,
      ]}
      closable={!loading}
      maskClosable={!loading}
      destroyOnClose
    >
      <div style={{ padding: '16px 0' }}>
        {typeof message === 'string' ? (
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
            {message}
          </p>
        ) : (
          message
        )}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
