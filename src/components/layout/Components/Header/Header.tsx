// src/components/layout/Header.tsx
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  StyledHeader,
  HeaderContainer,
  HeaderContent,
  LogoContainer,
  LogoIcon,
  ThemeToggleContainer
} from "./Header.styles";

export const Header: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <StyledHeader $isDark={isDark}>
      <HeaderContainer>        <HeaderContent>
          <LogoContainer>
            <LogoIcon src="/icon.svg" alt="Omni Chat" $isDark={isDark} />
          </LogoContainer>
          <ThemeToggleContainer>
            <ThemeToggle />
          </ThemeToggleContainer>
        </HeaderContent>
      </HeaderContainer>
    </StyledHeader>
  );
};
