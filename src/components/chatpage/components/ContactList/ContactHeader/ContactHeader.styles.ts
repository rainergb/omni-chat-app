// src/components/chatpage/components/ContactList/ContactHeader.styles.ts
import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
}

export const HeaderContainer = styled.div<StyledProps>`
  padding: 1rem;
  border-bottom: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  flex-shrink: 0;
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const Title = styled.h2<StyledProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
`;

export const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const SearchContainer = styled.div<StyledProps>`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled.input<StyledProps>`
  width: 100%;
  height: 40px;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border-radius: 20px;
  border: 1px solid ${(props) => (props.$isDark ? "#374151" : "#d1d5db")};
  background: ${(props) => (props.$isDark ? "#1f2937" : "#f9fafb")};
  color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  }

  &:focus {
    border-color: ${(props) => (props.$isDark ? "#00b9ae" : "#00b9ae")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.$isDark ? "rgba(0, 185, 174, 0.1)" : "rgba(0, 185, 174, 0.1)"};
    background: ${(props) => (props.$isDark ? "#374151" : "#ffffff")};
  }
`;

export const SearchIcon = styled.div<StyledProps>`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  pointer-events: none;
  z-index: 1;
`;

export const ClearButton = styled.button<StyledProps>`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => (props.$isDark ? "#9ca3af" : "#6b7280")};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$isDark ? "#4b5563" : "#e5e7eb")};
    color: ${(props) => (props.$isDark ? "#f9fafb" : "#111827")};
  }
`;

export const FilterSection = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
`;