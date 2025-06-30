import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
}

export const StyledModal = styled.div`
  /* Exemplo de estilização customizada para o modal */
  &.dark-modal {
    background: #18181b !important;
    color: #f3f4f6;
  }
  .ant-modal-content {
    background: inherit;
    color: inherit;
  }
  .ant-modal-title {
    color: inherit;
  }
`;

export const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin: 16px;
  gap: 8px;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

export const StyledButton = styled.div`
  width: 100%;
  margin-top: 8px;

  @media (min-width: 640px) {
    width: auto;
  }

  .ant-btn {
    width: 100%;
    background: linear-gradient(135deg, #00b9ae 0%, #1f2937 100%) !important;
    border: 0 !important;
    box-shadow: 0 4px 14px 0 rgba(0, 185, 174, 0.3) !important;
    transition: all 0.2s ease !important;

    &:hover {
      background: linear-gradient(135deg, #009d92 0%, #111827 100%) !important;
      box-shadow: 0 8px 20px 0 rgba(0, 185, 174, 0.4) !important;
      transform: translateY(-1px);
    }

    @media (min-width: 640px) {
      width: auto;
    }
  }

  &.custom-button .ant-btn {
    background: inherit !important;
    box-shadow: inherit !important;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TitleText = styled.span<StyledProps>`
  color: ${props => props.$isDark ? '#f3f4f6' : '#1f2937'};
`;