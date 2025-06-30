import styled from "styled-components";

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FooterContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;

export const StyledChatButton = styled.div`
  .ant-btn {
    background: linear-gradient(135deg, #00b9ae 0%, #1f2937 100%) !important;
    border: 0 !important;
    box-shadow: 0 4px 14px 0 rgba(0, 185, 174, 0.3) !important;
    transition: all 0.2s ease !important;

    &:hover {
      background: linear-gradient(135deg, #009d92 0%, #111827 100%) !important;
      box-shadow: 0 8px 20px 0 rgba(0, 185, 174, 0.4) !important;
      transform: translateY(-1px);
    }
  }
`;

export const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  gap: 16px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  gap: 16px;
`;

export const LoadingText = styled.span<{ $isDark: boolean }>`
  font-size: 14px;
  color: ${props => props.$isDark ? '#d1d5db' : '#4b5563'};
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  gap: 16px;
`;

export const ErrorIconContainer = styled.div<{ $isDark: boolean }>`
  padding: 16px;
  border-radius: 50%;
  background-color: ${props => props.$isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2'};
`;

export const ErrorTitle = styled.p`
  color: #ef4444;
  text-align: center;
  margin: 0;
`;

export const ErrorMessage = styled.p<{ $isDark: boolean }>`
  font-size: 12px;
  text-align: center;
  color: ${props => props.$isDark ? '#9ca3af' : '#6b7280'};
  margin: 0;
`;

export const QRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const QRImageContainer = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 14px 0 rgba(0, 185, 174, 0.3);
`;

export const QRImage = styled.img`
  border-radius: 4px;
`;

export const InstructionsContainer = styled.div<{ $isDark: boolean }>`
  text-align: center;
  color: ${props => props.$isDark ? '#d1d5db' : '#4b5563'};
`;

export const InstructionTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 4px 0;
`;

export const InstructionSubtitle = styled.p`
  font-size: 12px;
  margin: 0;
`;

export const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  gap: 16px;
`;

export const EmptyIconContainer = styled.div<{ $isDark: boolean }>`
  padding: 16px;
  border-radius: 50%;
  background-color: ${props => props.$isDark ? '#374151' : '#f3f4f6'};
`;

export const EmptyText = styled.p<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#9ca3af' : '#6b7280'};
  margin: 0;
`;