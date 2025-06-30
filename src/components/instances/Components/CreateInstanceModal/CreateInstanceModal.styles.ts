import styled from "styled-components";

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledForm = styled.div`
  margin-top: 24px;
`;

export const FormLabel = styled.span<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#e5e7eb' : '#374151'};
`;

export const PlatformOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledInput = styled.div<{ $isDark: boolean }>`
  .ant-input {
    ${props => props.$isDark && `
      background-color: #374151 !important;
      border-color: #4b5563 !important;
      color: #f3f4f6 !important;
    `}
  }
`;

export const StyledSelect = styled.div<{ $isDark: boolean }>`
  .ant-select {
    ${props => props.$isDark && `
      .ant-select-selector {
        background-color: #374151 !important;
        border-color: #4b5563 !important;
        color: #f3f4f6 !important;
      }
    `}
  }
`;

export const StyledInputNumber = styled.div`
  width: 100%;
  
  .ant-input-number {
    width: 100%;
  }
`;

export const TimeInputLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const WebhookInputContainer = styled.div<{ $isDark: boolean }>`
  .ant-input-group-addon {
    ${props => props.$isDark && `
      background-color: #374151 !important;
      border-color: #4b5563 !important;
      color: #f3f4f6 !important;
    `}
  }
  
  .ant-input {
    ${props => props.$isDark && `
      background-color: #374151 !important;
      border-color: #4b5563 !important;
      color: #f3f4f6 !important;
    `}
  }
`;

// Estilos globais para os botões
export const GlobalButtonStyles = styled.div`
  .whatsapp-button.ant-btn {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%) !important;
    border: 0 !important;
    box-shadow: 0 4px 14px 0 rgba(34, 197, 94, 0.3) !important;
    transition: all 0.2s ease !important;
    color: white !important;
    border-color: transparent !important;

    &:hover, &:focus {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
      box-shadow: 0 8px 20px 0 rgba(34, 197, 94, 0.4) !important;
      transform: translateY(-1px);
      color: white !important;
      border-color: transparent !important;
    }

    &:disabled {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
      box-shadow: none !important;
      transform: none !important;
      opacity: 0.6;
    }
  }

  .default-button.ant-btn {
    background: linear-gradient(135deg, #00b9ae 0%, #1f2937 100%) !important;
    border: 0 !important;
    box-shadow: 0 4px 14px 0 rgba(0, 185, 174, 0.3) !important;
    transition: all 0.2s ease !important;
    color: white !important;
    border-color: transparent !important;

    &:hover, &:focus {
      background: linear-gradient(135deg, #009d92 0%, #111827 100%) !important;
      box-shadow: 0 8px 20px 0 rgba(0, 185, 174, 0.4) !important;
      transform: translateY(-1px);
      color: white !important;
      border-color: transparent !important;
    }

    &:disabled {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
      box-shadow: none !important;
      transform: none !important;
      opacity: 0.6;
    }
  }
`;