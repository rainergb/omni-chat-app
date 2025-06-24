// src/components/chatpage/components/ChatLayout/ChatLayout.styles.ts
import styled from "styled-components";

interface StyledProps {
  $isDark?: boolean;
  $hasSelectedChat?: boolean;
}

export const LayoutContainer = styled.div<StyledProps>`
  display: flex;
  height: 100vh;
  width: 100%;
  background: ${(props) => (props.$isDark ? "#030712" : "#f0f0f0")};
  overflow: hidden;
  position: relative;
`;

export const LeftPanel = styled.div<StyledProps>`
  width: 400px;
  height: 100%;
  background: ${(props) => (props.$isDark ? "#0f172a" : "#ffffff")};
  border-right: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    position: ${(props) => (props.$hasSelectedChat ? "absolute" : "static")};
    width: 100%;
    z-index: ${(props) => (props.$hasSelectedChat ? "1" : "auto")};
    transform: ${(props) =>
      props.$hasSelectedChat ? "translateX(-100%)" : "translateX(0)"};
  }

  @media (min-width: 1200px) {
    width: 420px;
  }

  @media (min-width: 1400px) {
    width: 450px;
  }
`;

export const RightPanel = styled.div<StyledProps>`
  flex: 1;
  height: 100%;
  background: ${(props) => (props.$isDark ? "#030712" : "#f8fafc")};
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    display: ${(props) => (props.$hasSelectedChat ? "none" : "flex")};
  }
`;

export const MobileOverlay = styled.div<StyledProps>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) => (props.$isDark ? "#030712" : "#f8fafc")};
    z-index: 10;
    flex-direction: column;
  }
`;

export const NoInstanceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
`;