// src/components/layout/Components/Header/Header.styles.ts
import styled from "styled-components";

export const StyledHeader = styled.header<{ $isDark: boolean }>`
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  border-bottom: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  background-color: ${(props) => (props.$isDark ? "#030712" : "#f9fafb")};
  transition: all 0.3s ease;
`;

export const HeaderContainer = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  
  @media (min-width: 640px) {
    padding: 0.75rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 0.75rem 2rem;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 112rem;
  margin: 0 auto;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
`;

export const LogoIcon = styled.img<{ $isDark: boolean }>`
  height: 32px;
  width: auto;
  filter: ${(props) =>
    props.$isDark
      ? "brightness(0) saturate(100%) invert(64%) sepia(11%) saturate(200%) hue-rotate(176deg) brightness(90%) contrast(85%)"
      : "brightness(0) saturate(100%) invert(39%) sepia(21%) saturate(245%) hue-rotate(176deg) brightness(94%) contrast(97%)"};
  transition: all 0.3s ease;

  @media (min-width: 640px) {
    height: 36px;
  }

  ${LogoContainer}:hover & {
    filter: none;
  }
`;

export const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (min-width: 640px) {
    gap: 0.75rem;
  }
`;
