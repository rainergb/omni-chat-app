// src/components/layout/Header.tsx
import React from "react";
import { MessageOutlined, SettingOutlined } from "@ant-design/icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigation, NavigationTab } from "@/contexts/NavigationContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Segmented } from "@/components/ui/Segmented";
import {
  StyledHeader,
  HeaderContainer,
  HeaderContent,
  LogoContainer,
  LogoIcon,
  NavigationContainer,
  ThemeToggleContainer
} from "./Header.styles";

export const Header: React.FC = () => {
  const { isDark } = useTheme();
  const { activeTab, setActiveTab } = useNavigation();

  const navigationOptions = [
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <SettingOutlined />
          <span>Instâncias</span>
        </div>
      ),
      value: "instances" as NavigationTab
    },
    {
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <MessageOutlined />
          <span>Chat</span>
        </div>
      ),
      value: "chat" as NavigationTab
    }
  ];

  return (
    <StyledHeader $isDark={isDark}>
      <HeaderContainer>
        <HeaderContent>
          <LogoContainer>
            <LogoIcon src="/icon.svg" alt="Omni Chat" $isDark={isDark} />
          </LogoContainer>

          <NavigationContainer>
            <Segmented
              options={navigationOptions}
              value={activeTab}
              onChange={(value) => setActiveTab(value as NavigationTab)}
              size="large"
            />
          </NavigationContainer>

          <ThemeToggleContainer>
            <ThemeToggle />
          </ThemeToggleContainer>
        </HeaderContent>
      </HeaderContainer>
    </StyledHeader>
  );
};
