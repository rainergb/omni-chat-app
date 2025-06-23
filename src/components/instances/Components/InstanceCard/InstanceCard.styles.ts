// src/components/instances/Components/InstanceCard/InstanceCard.styles.ts
import styled from 'styled-components';
import { Avatar as AntAvatar, Button as AntButton } from 'antd';
import { type ThemeColors } from "@/libs/theme";

interface StyledProps {
  $isDark?: boolean;
  $isConnected?: boolean;
  $isConnecting?: boolean;
  $hasError?: boolean;
  $colors?: ThemeColors;
}

export const CardContainer = styled.div`
  position: relative;

  &:hover .dropdown-button {
    opacity: 1;
  }
`;

export const CardContent = styled.div`
  padding: 1rem;

  @media (min-width: 640px) {
    padding: 1.5rem;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    margin-bottom: 1.5rem;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
`;

export const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const Avatar = styled(AntAvatar)<StyledProps>`
  ring-width: 2px;
  transition: all 0.2s;
  background-color: ${({ $colors }) => $colors?.gunmetal || "#f3f4f6"};
  font-size: 20px;

  ${({ $isConnected, $isConnecting, $hasError }) => {
    if ($isConnected) return "border: 2px solid rgb(187 247 208);"; // ring-green-200
    if ($isConnecting) return "border: 2px solid rgb(254 240 138);"; // ring-yellow-200
    if ($hasError) return "border: 2px solid rgb(254 202 202);"; // ring-red-200
    return "border: 2px solid rgb(229 231 235);"; // ring-gray-200
  }}
`;


export const InstanceInfo = styled.div`
  min-width: 0;
  flex: 1;
`;

export const InstanceName = styled.h3<StyledProps>`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ $colors }) => $colors?.textPrimary || "#1f2937"};

  @media (min-width: 640px) {
    font-size: 1.125rem;
  }
`;

export const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const DropdownButton = styled(AntButton)<StyledProps>`
  opacity: 0;
  transition: opacity 0.2s;
  flex-shrink: 0;

  &.dropdown-button {
    &:hover {
      background-color: ${({ $colors }) => $colors?.surfaceHover || "#f9fafb"};
    }
  }
`;

export const StatsSection = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (min-width: 640px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

export const StatItem = styled.div<StyledProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: ${({ $isDark }) => ($isDark ? "#374151" : "#ffffff")};
  border: 1px solid ${({ $isDark }) => ($isDark ? "#4b5563" : "#e2e8f0")};

  @media (min-width: 640px) {
    padding: 1rem;
  }
`;

export const StatLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
`;

export const StatIcon = styled.div<StyledProps>`
  flex-shrink: 0;
  color: ${({ $colors }) => $colors?.lightSeaGreen || "#6b7280"};
`;

export const MessageStatIcon = styled.div<StyledProps>`
  flex-shrink: 0;
  color: ${({ $isDark }) => ($isDark ? "#00b9ae" : "#1f2937")};
`;

export const StatLabel = styled.span<StyledProps>`
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ $isDark }) => ($isDark ? "#00b9ae" : "#374151")};

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
`;

export const MessageStatLabel = styled.span<StyledProps>`
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ $isDark }) => ($isDark ? "#00b9ae" : "#1f2937")};

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
`;

export const StatValue = styled.span<StyledProps>`
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
  color: ${({ $isDark }) => ($isDark ? "#f3f4f6" : "#1f2937")};

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

export const StatValueSmall = styled.span<StyledProps>`
  font-size: 0.75rem;
  flex-shrink: 0;
  color: ${({ $isDark }) => ($isDark ? "#d1d5db" : "#6b7280")};

  @media (min-width: 640px) {
    font-size: 0.875rem;
  }
`;

export const ActionsSection = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (min-width: 640px) {
    gap: 0.75rem;
  }
`;

export const ConnectButton = styled(AntButton)<StyledProps>`
  flex: 1;

  @media (min-width: 640px) {
    flex: initial;
  }

  ${({ $isConnected, $isDark }) =>
    $isConnected &&
    `
    border-color: ${$isDark ? "#4b5563" : "#d1d5db"};
    color: ${$isDark ? "#d1d5db" : "inherit"};
  `}

  .hidden-sm {
    display: none;

    @media (min-width: 640px) {
      display: inline;
    }
  }
`;

export const ChatButton = styled(AntButton)<StyledProps>`
  flex-shrink: 0;
  transition: colors 0.2s;

  &.ant-btn[disabled] {
    color: #9ca3af !important;
    cursor: not-allowed !important;
    background-color: transparent !important;

    &:hover {
      background-color: transparent !important;
      color: #9ca3af !important;
    }
  }

  ${({ $isConnected }) =>
    $isConnected
      ? `
    color: #00B9AE;
    
    &:hover {
      background-color: rgba(0, 185, 174, 0.1);
    }
    
    &:hover:where([data-theme="dark"], [data-theme="dark"] *) {
      background-color: rgba(15, 23, 42, 0.2);
    }
  `
      : `
    color: #9ca3af;
  `}
`;

export const WebhookIndicator = styled.div<StyledProps>`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ $isDark }) => ($isDark ? "#374151" : "#f3f4f6")};
`;

export const WebhookText = styled.span<StyledProps>`
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${({ $isDark }) => ($isDark ? "#9ca3af" : "#6b7280")};
`;

export const WebhookDot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  background-color: #00b9ae; /* Light sea green */
  border-radius: 50%;
`;
