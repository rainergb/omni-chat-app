import React, { ReactNode } from "react";
import { Modal as AntModal, Button } from "antd";
import { useTheme } from "@/contexts/ThemeContext";

interface ModalProps {
  open: boolean;
  onCancel: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: string | number;
  maxWidth?: string;
  cancelText?: string;
  okText?: string;
  okButtonProps?: {
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    type?: "primary" | "default" | "dashed" | "link" | "text";
    onClick?: () => void;
  };
  showFooter?: boolean;
  showCancel?: boolean;
  showOk?: boolean;
  destroyOnHidden?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onCancel,
  title,
  children,
  footer,
  width = "100%",
  maxWidth = "500px",
  okText = "Confirmar",
  okButtonProps,
  showFooter = true,
  showOk = true,
  destroyOnHidden = true,
  className = "",
  style,
  ...props
}) => {
  const { isDark } = useTheme();
  const defaultFooter =
    showFooter && !footer ? (
      <div className="flex flex-col sm:flex-row justify-end m-4 gap-2">
        {showOk && (
          <Button
            type="primary"
            size="large"
            className={`w-full sm:w-auto mt-2 ${
              okButtonProps?.className ||
              "bg-gradient-to-r from-teal-500 to-slate-800 hover:from-teal-600 hover:to-slate-900 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            }`}
            style={{
              background: okButtonProps?.className
                ? undefined
                : "linear-gradient(135deg, #00b9ae 0%, #1f2937 100%)",
              borderColor: "transparent",
              boxShadow: "0 4px 14px 0 rgba(0, 185, 174, 0.3)"
            }}
            {...okButtonProps}
          >
            {okText}
          </Button>
        )}
      </div>
    ) : (
      footer
    );

  const modalTitle =
    typeof title === "string" ? (
      <div className="flex items-center space-x-2">
        <span className={isDark ? "text-gray-100" : "text-gray-800"}>
          {title}
        </span>
      </div>
    ) : (
      title
    );

  return (
    <AntModal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      footer={showFooter ? defaultFooter : null}
      destroyOnHidden={destroyOnHidden}
      className={`${isDark ? "dark-modal" : ""} ${className}`.trim()}
      width={width}
      style={{
        maxWidth,
        top: "10vh",
        ...style
      }}
      {...props}
    >
      {children}
    </AntModal>
  );
};
