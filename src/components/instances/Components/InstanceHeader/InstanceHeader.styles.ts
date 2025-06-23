// src/components/instances/InstanceHeader/InstanceHeader.styles.ts
import styled from "styled-components";
import { Button } from "antd";

export const HeaderContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  padding: 0.5rem 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => (props.$isDark ? "#374151" : "#f3f4f6")};
  background: ${(props) => (props.$isDark ? "#1f2937" : "#ffffff")};

  @media (min-width: 640px) {
    padding: 0.75rem 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0.75rem 2rem;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 112rem;
  margin: 0 auto;
`;

export const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SearchContainer = styled.div<{ $isDark: boolean }>`
  position: relative;
  width: 320px;
`;

export const SearchInput = styled.input<{ $isDark: boolean }>`
  width: 100%;
  height: 40px;
  padding: 8px 12px 8px 40px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$isDark ? "#4b5563" : "#d1d5db")};
  background: ${(props) => (props.$isDark ? "#374151" : "#ffffff")};
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  }

  &:focus {
    border-color: ${(props) => (props.$isDark ? "#3b82f6" : "#3b82f6")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.1)"};
  }
`;

export const SearchIcon = styled.div<{ $isDark: boolean }>`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  pointer-events: none;
`;

export const ClearButton = styled.button<{ $isDark: boolean; $visible: boolean }>`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  visibility: ${(props) => (props.$visible ? "visible" : "hidden")};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$isDark ? "#4b5563" : "#f3f4f6")};
  }
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StyledButton = styled(Button)<{ $isDark: boolean }>`
  &.ant-btn {
    height: 40px;
    border-radius: 8px;
    ${(props) =>
      props.$isDark
        ? `
      border-color: #4b5563;
      background: #374151;
      color: #d1d5db;
      
      &:hover {
        background: #4b5563 !important;
        border-color: #6b7280 !important;
      }
    `
        : `
      border-color: #d1d5db;
      background: #f9fafb;
      
      &:hover {
        background: #f3f4f6 !important;
        border-color: #9ca3af !important;
      }
    `}
  }
`;

export const GradientButton = styled(Button)`
  &.ant-btn {
    height: 40px;
    border-radius: 8px;
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
    border: none;
    color: white;
    box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.4) !important;
      background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%) !important;
    }
  }
`;
