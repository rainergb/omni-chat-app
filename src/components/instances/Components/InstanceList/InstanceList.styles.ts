// src/components/instances/Components/InstanceList/InstanceList.styles.ts
import styled from 'styled-components';
import { Button as AntButton } from 'antd';

interface StyledProps {
  $isDark?: boolean;
  $isConnected?: boolean;
  $loading?: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 1.5rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 112rem;
  margin: 0 auto;
`;

export const ListContainer = styled.div<StyledProps>`
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: ${({ $isDark }) => ($isDark ? '#1f2937' : '#ffffff')};
  border: 1px solid ${({ $isDark }) => ($isDark ? '#374151' : '#e5e7eb')};
`;

export const ListHeader = styled.div<StyledProps>`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 1.5fr;
  gap: 1rem;
  padding: 1rem 1rem;
  background-color: ${({ $isDark }) => ($isDark ? '#111827' : '#f9fafb')};
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#374151' : '#e5e7eb')};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ $isDark }) => ($isDark ? '#d1d5db' : '#374151')};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    
    & > *:not(:first-child) {
      display: none;
    }
  }
`;

export const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ListContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ListRow = styled.div<StyledProps>`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 1.5fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ $isDark }) => ($isDark ? '#374151' : '#e5e7eb')};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ $isDark }) => ($isDark ? '#374151' : '#f9fafb')};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  ${({ $loading }) => $loading && `
    opacity: 0.7;
    pointer-events: none;
  `}
`;

export const ListCell = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  
  @media (max-width: 768px) {
    &:not(:first-child) {
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(156, 163, 175, 0.2);
      
      &:before {
        content: attr(data-label);
        font-weight: 600;
        color: inherit;
        opacity: 0.7;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

export const InstanceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
`;

export const InstanceAvatar = styled.div<StyledProps>`
  position: relative;
  flex-shrink: 0;

  .ant-avatar {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      color: ${({ $isDark }) => ($isDark ? "#d1d5db" : "#374151")} !important;
    }
  }
`;

export const InstanceDetails = styled.div`
  min-width: 0;
  flex: 1;
`;

export const InstanceName = styled.div<StyledProps>`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ $isDark }) => ($isDark ? "#f3f4f6" : "#111827")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const InstanceType = styled.div<StyledProps>`
  font-size: 0.75rem;
  color: ${({ $isDark }) => ($isDark ? "#9ca3af" : "#6b7280")};
  text-transform: capitalize;
`;

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StatsBadge = styled.div<StyledProps>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${({ $isDark }) => ($isDark ? "#374151" : "#f3f4f6")};
  color: ${({ $isDark }) => ($isDark ? "#d1d5db" : "#374151")};
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

export const ActionButton = styled(AntButton)<StyledProps>`
  &.ant-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    &[disabled] {
      color: #9ca3af !important;
      cursor: not-allowed !important;
      background-color: transparent !important;

      &:hover {
        background-color: transparent !important;
        border-color: transparent !important;
        color: #9ca3af !important;
      }
    }

    ${({ $isConnected }) =>
      $isConnected
        ? `
      color: #00B9AE;
      
      &:hover {
        background-color: rgba(0, 185, 174, 0.1) !important;
        border-color: rgba(0, 185, 174, 0.2) !important;
      }
    `
        : `
      color: #9ca3af;
      
      &:hover {
        background-color: rgba(156, 163, 175, 0.1) !important;
      }
    `}
  }
`;

export const ConnectButton = styled(AntButton)<StyledProps>`
  &.ant-btn {
    font-size: 0.75rem;
    height: 28px;

    ${({ $isConnected, $isDark }) =>
      $isConnected
        ? `
      border-color: ${$isDark ? "#4b5563" : "#d1d5db"};
      color: ${$isDark ? "#d1d5db" : "inherit"};
      background-color: ${$isDark ? "#374151" : "#ffffff"};
      
      &:hover {
        background-color: ${$isDark ? "#4b5563" : "#f9fafb"} !important;
        border-color: ${$isDark ? "#6b7280" : "#9ca3af"} !important;
      }
    `
        : ""}
  }
`;

export const DropdownButton = styled(AntButton)<StyledProps>`
  &.ant-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: ${({ $isDark }) =>
        $isDark
          ? "rgba(75, 85, 99, 0.5)"
          : "rgba(243, 244, 246, 0.8)"} !important;
    }
  }
`;

export const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24rem;
  padding: 2rem;
`;

export const EmptyContent = styled.div`
  text-align: center;
  max-width: 28rem;
`;

export const EmptyIconContainer = styled.div<StyledProps>`
  width: 6rem;
  height: 6rem;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $isDark }) => ($isDark ? "#1f2937" : "#f3f4f6")};
`;

export const EmptyTitle = styled.h3<StyledProps>`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ $isDark }) => ($isDark ? "#e5e7eb" : "#374151")};
`;

export const EmptyDescription = styled.p<StyledProps>`
  margin-bottom: 1.5rem;
  color: ${({ $isDark }) => ($isDark ? "#9ca3af" : "#6b7280")};
  line-height: 1.5;
`;

export const CreateButton = styled(AntButton)`
  background: linear-gradient(to right, #00b9ae, #1f2937);
  border: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);

  &:hover {
    background: linear-gradient(to right, #00a69b, #0f172a) !important;
  }

  &:focus {
    background: linear-gradient(to right, #00a69b, #0f172a) !important;
  }
`;

export const WebhookIndicator = styled.div`
  display: flex;
  align-items: center;
`;

export const WebhookDot = styled.div`
  width: 0.375rem;
  height: 0.375rem;
  background-color: #00b9ae; /* Light sea green */
  border-radius: 50%;
  flex-shrink: 0;
`;
