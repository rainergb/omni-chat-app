// hooks/use-notification.tsx
import { message, notification } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

export interface NotificationOptions {
  duration?: number;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  description?: string;
  showProgress?: boolean;
}

export const useNotification = () => {
  const showSuccess = (title: string, options?: NotificationOptions) => {
    message.success(title, options?.duration);

    if (options?.description) {
      notification.success({
        message: title,
        description: options.description,
        duration: options.duration || 4.5,
        placement: options.placement || 'topRight',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        showProgress: options.showProgress,
      });
    }
  };

  const showError = (title: string, options?: NotificationOptions) => {
    message.error(title, options?.duration);

    if (options?.description) {
      notification.error({
        message: title,
        description: options.description,
        duration: options.duration || 4.5,
        placement: options.placement || 'topRight',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
        showProgress: options.showProgress,
      });
    }
  };

  const showWarning = (title: string, options?: NotificationOptions) => {
    message.warning(title, options?.duration);

    if (options?.description) {
      notification.warning({
        message: title,
        description: options.description,
        duration: options.duration || 4.5,
        placement: options.placement || 'topRight',
        icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
        showProgress: options.showProgress,
      });
    }
  };

  const showInfo = (title: string, options?: NotificationOptions) => {
    message.info(title, options?.duration);

    if (options?.description) {
      notification.info({
        message: title,
        description: options.description,
        duration: options.duration || 4.5,
        placement: options.placement || 'topRight',
        icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
        showProgress: options.showProgress,
      });
    }
  };

  const showLoading = (title: string, duration?: number) => {
    return message.loading(title, duration || 0);
  };

  const destroy = () => {
    message.destroy();
    notification.destroy();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    destroy,
  };
};

export default useNotification;
