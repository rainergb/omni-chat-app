// src/components/layout/Footer.tsx
import React from "react";
import { Button, Tooltip } from "antd";
import { Github, Globe, HelpCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import styled from "styled-components";

const StyledFooter = styled.footer<{ $isDark: boolean }>`
  width: 100%;
  border-top: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  background-color: ${(props) => (props.$isDark ? "#030712" : "#f9fafb")};
  transition: all 0.3s ease;
`;

const FooterContainer = styled.div`
  width: 100%;
  padding: 0.5rem 1rem;
  
  @media (min-width: 640px) {
    padding: 0.75rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 0.75rem 2rem;
  }
`;

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 0.5rem;
`;

const LinksContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const VersionBadge = styled.div<{ $isDark: boolean }>`
  display: flex;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${(props) => (props.$isDark ? "#374151" : "#ffffff")};
  color: ${(props) => (props.$isDark ? "#d1d5db" : "#4b5563")};
  border: 1px solid ${(props) => (props.$isDark ? "#4b5563" : "#d1d5db")};
  box-shadow: ${(props) => (props.$isDark ? "none" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)")};
`;

export const Footer: React.FC = () => {
  const { isDark } = useTheme();
  return (
    <StyledFooter $isDark={isDark}>
      <FooterContainer>
        <CenteredContainer>
          {/* Links úteis - centralizados e sempre visíveis */}
          <LinksContainer>
            <Tooltip title="Documentação">
              <Button
                type="text"
                icon={<HelpCircle size={16} />}
                className={`${
                  isDark
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                }`}
              />
            </Tooltip>

            <Tooltip title="Website">
              <Button
                type="text"
                icon={<Globe size={16} />}
                className={`${
                  isDark
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                }`}
              />
            </Tooltip>

            <Tooltip title="GitHub">
              <Button
                type="text"
                icon={<Github size={16} />}
                className={`${
                  isDark
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                }`}
              />
            </Tooltip>
          </LinksContainer>          {/* Badge de versão - centralizado */}
          <BadgeContainer>
            <VersionBadge $isDark={isDark}>
              v1.0.0
            </VersionBadge>
          </BadgeContainer>
        </CenteredContainer>
      </FooterContainer>
    </StyledFooter>
  );
};
