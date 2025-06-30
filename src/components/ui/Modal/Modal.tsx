import React, { ReactNode } from "react";
import { Modal as AntModal, Button } from "antd";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  StyledModal, 
  FooterContainer, 
  StyledButton, 
  TitleContainer, 
  TitleText 
} from "./Modal.styles";

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
      <FooterContainer>
        {showOk && (
          <StyledButton className={okButtonProps?.className ? "custom-button" : ""}>
            <Button
              type="primary"
              size="large"
              {...okButtonProps}
            >
              {okText}
            </Button>
          </StyledButton>
        )}
      </FooterContainer>
    ) : (
      footer
    );

  const modalTitle =
    typeof title === "string" ? (
      <TitleContainer>
        <TitleText theme={{ isDark }}>
          {title}
        </TitleText>
      </TitleContainer>
    ) : (
      title
    );

  return (
    <StyledModal className={`${isDark ? "dark-modal" : ""} ${className}`.trim()}>
      <AntModal
        title={modalTitle}
        open={open}
        onCancel={onCancel}
        footer={showFooter ? defaultFooter : null}
        destroyOnHidden={destroyOnHidden}
        className="modal-content"
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
    </StyledModal>
  );
};