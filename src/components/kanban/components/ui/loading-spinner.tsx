// components/ui/loading-spinner.tsx
import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  spinning?: boolean;
  children?: React.ReactNode;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  tip,
  spinning = true,
  children,
  overlay = false,
}) => {
  const antIcon = (
    <LoadingOutlined
      style={{ fontSize: size === 'small' ? 14 : size === 'large' ? 24 : 18 }}
      spin
    />
  );

  if (overlay && children) {
    return (
      <Spin
        spinning={spinning}
        tip={tip}
        size={size}
        indicator={antIcon}
        style={{
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Spin>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: overlay ? '100px' : 'auto',
        padding: '20px',
      }}
    >
      <Spin spinning={spinning} tip={tip} size={size} indicator={antIcon} />
    </div>
  );
};

export default LoadingSpinner;
