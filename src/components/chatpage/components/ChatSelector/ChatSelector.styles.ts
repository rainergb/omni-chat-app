// src/components/chatpage/components/ChatSelector/ChatSelector.styles.ts
import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
  $status?: string;
}

export const SelectorContainer = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: ${(props) => (props.$isDark ? "#030712" : "#f8fafc")};
  padding: 2rem;
`;

export const SelectorContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

export const SelectorIcon = styled.div<StyledProps>`
  margin-bottom: 1.5rem;
  color: ${(props) => (props.$isDark ? "#6b7280" : "#9ca3af")};
  opacity: 0.6;
`;

export const SelectorTitle = styled.h2<StyledProps>`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
`;

export const SelectorDescription = styled.p<StyledProps>`
  font-size: 0.875rem;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 400px;
`;

export const InstancesList = styled.div<StyledProps>`
  width: 100%;
  max-width: 400px;
  margin-bottom: 2rem;
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  overflow: hidden;
`;

export const InstanceItem = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid ${(props) => (props.$isDark ? "#374151" : "#f3f4f6")};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const InstanceInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;

export const InstanceName = styled.div<StyledProps>`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
`;

export const InstanceStatus = styled.div<StyledProps>`
  font-size: 0.75rem;
  color: ${(props) => {
    if (props.$status === "error") {
      return "#ef4444"; // red
    }
    return props.$isDark ? "#9ca3af" : "#6b7280";
  }};
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;