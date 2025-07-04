import styled from 'styled-components';

interface MainContainerProps {
  $isMenuCollapsed: boolean;
}

export const MainContainer = styled.div<MainContainerProps>`
  background-color: white;
  border-radius: 6px;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  margin: 0 28px 28px 28px;
  height: 100vh;
  width: ${(props) =>
    props.$isMenuCollapsed ? 'calc(100vw - 62px)' : 'calc(100vw - 240px)'};
  transition: all 0.2s ease-in-out;

  /* Responsividade para mobile */
  @media (max-width: 768px) {
    margin: 0 8px 8px 8px;
    width: calc(100vw - 16px);
    border-radius: 4px;
  }

  @media (max-width: 480px) {
    margin: 0;
    width: 100vw;
    border-radius: 0;
    height: 100vh;
  }
`;

export const ContentContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 24px;

  /* Responsividade */
  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderContent = styled.div``;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

export const Subtitle = styled.p`
  color: #6b7280;
  margin: 0 0 16px 0;
`;

export const ButtonContainer = styled.div``;

export const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  /* Responsividade */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 12px;
  }
`;

export const FilterSelect = styled.div`
  width: 192px;

  /* Responsividade */
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BoardsContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  height: 100%;

  /* Scroll horizontal suave */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    &::-webkit-scrollbar {
      height: 6px;
    }
  }

  @media (max-width: 480px) {
    &::-webkit-scrollbar {
      height: 4px;
    }
  }
`;

export const BoardsContent = styled.div`
  display: flex;
  gap: 16px;
  height: 100%;
  min-width: fit-content;
  padding-bottom: 8px;

  /* Responsividade */
  @media (max-width: 768px) {
    gap: 12px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding-bottom: 4px;
  }
`;

interface BoardColumnProps {
  $isCollapsed?: boolean;
}

export const BoardColumn = styled.div<BoardColumnProps>`
  background-color: #f5f5f5;
  padding: 6px;
  border-radius: 6px;
  min-width: ${(props) => (props.$isCollapsed ? '60px' : '280px')};
  max-width: ${(props) => (props.$isCollapsed ? '60px' : '320px')};
  width: ${(props) => (props.$isCollapsed ? '60px' : '300px')};
  height: 100%;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease-in-out;
  position: relative;

  /* Responsividade */
  @media (max-width: 768px) {
    min-width: ${(props) => (props.$isCollapsed ? '50px' : '250px')};
    max-width: ${(props) => (props.$isCollapsed ? '50px' : '280px')};
    width: ${(props) => (props.$isCollapsed ? '50px' : '260px')};
  }

  @media (max-width: 480px) {
    min-width: ${(props) => (props.$isCollapsed ? '40px' : '220px')};
    max-width: ${(props) => (props.$isCollapsed ? '40px' : '250px')};
    width: ${(props) => (props.$isCollapsed ? '40px' : '235px')};
    padding: 4px;
  }
`;

export const DroppableArea = styled.div`
  min-height: 200px;
  padding: 6px 0;
`;

export const DraggableItem = styled.div`
  /* O ref e props do drag são aplicados aqui pelo react-beautiful-dnd */
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const EmptyStateText = styled.p`
  color: #6b7280;
  margin: 0;
`;

/* Novos componentes para responsividade */
export const ColumnHeader = styled.div<{ $isCollapsed?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px 6px 0 0;
  position: relative;
  min-height: 40px;
`;

export const ColumnTitle = styled.h3<{ $isCollapsed?: boolean }>`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  white-space: ${(props) => (props.$isCollapsed ? 'nowrap' : 'normal')};
  overflow: hidden;
  text-overflow: ellipsis;
  writing-mode: ${(props) =>
    props.$isCollapsed ? 'vertical-rl' : 'horizontal-tb'};
  text-orientation: ${(props) => (props.$isCollapsed ? 'mixed' : 'initial')};
  transition: all 0.3s ease-in-out;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

export const ColumnContent = styled.div<{ $isCollapsed?: boolean }>`
  display: ${(props) => (props.$isCollapsed ? 'none' : 'block')};
  transition: all 0.3s ease-in-out;
`;

export const ColumnCollapsedIndicator = styled.div<{ $isCollapsed?: boolean }>`
  display: ${(props) => (props.$isCollapsed ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 12px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  padding: 8px 0;
`;

export const CollapseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #666;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    color: #333;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 480px) {
    padding: 2px;
  }
`;

export const TaskCount = styled.span<{ $isCollapsed?: boolean }>`
  background: #e5e5e5;
  color: #333;
  border-radius: 6px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: normal;

  ${(props) =>
    props.$isCollapsed &&
    `
    writing-mode: vertical-rl;
    text-orientation: mixed;
    padding: 6px 2px;
    margin: 4px 0;
  `}

  @media (max-width: 480px) {
    padding: 1px 4px;
    font-size: 10px;
  }
`;

export const ResponsiveIndicator = styled.div`
  /* Indicador para mostrar quando está em modo responsivo */
  @media (max-width: 768px) {
    &::after {
      content: '📱';
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 1000;
    }
  }

  @media (max-width: 480px) {
    &::after {
      content: '📱 Mobile';
    }
  }
`;
