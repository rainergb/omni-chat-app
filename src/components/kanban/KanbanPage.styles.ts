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
  height: calc(100vh - 56px); /* Altura fixa baseada na viewport */
  max-height: calc(100vh - 56px); /* Altura máxima */
  width: ${(props) =>
    props.$isMenuCollapsed ? 'calc(100vw - 62px)' : 'calc(100vw - 240px)'};
  transition: all 0.2s ease-in-out;
  overflow: hidden; /* Evita overflow do container principal */
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    margin: 0 8px 8px 8px;
    width: calc(100vw - 16px);
    border-radius: 4px;
    height: calc(100vh - 32px);
    max-height: calc(100vh - 32px);
  }

  @media (max-width: 480px) {
    margin: 0;
    width: 100vw;
    border-radius: 0;
    height: 100vh;
    max-height: 100vh;
  }
`;

export const HeaderContainer = styled.div`
  flex-shrink: 0; /* Não permite que o header diminua */
  padding: 12px 24px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
  }
`;

export const ContentContainer = styled.div`
  flex: 1; /* Ocupa o restante do espaço disponível */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Evita que o conteúdo vaze */
  padding: 24px;
  min-height: 0; /* Importante para flexbox funcionar corretamente */
  height: 100%; /* Garante altura total */

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
  }
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
`;

export const HeaderContent = styled.div``;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const Subtitle = styled.p`
  color: #6b7280;
  margin: 0 0 16px 0;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 0 0 12px 0;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    margin: 0 0 8px 0;
  }
`;

export const ButtonContainer = styled.div``;

export const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-shrink: 0;

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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const BoardsContainer = styled.div`
  flex: 1; /* Ocupa o restante do espaço */
  width: 100%;
  overflow: auto; /* Permite scroll quando necessário */
  min-height: 0; /* Importante para flexbox */

  /* Scroll suave */
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;

  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
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

  @media (max-width: 768px) {
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
  }

  @media (max-width: 480px) {
    &::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
  }
`;

export const BoardsContent = styled.div`
  display: flex;
  gap: 16px;
  height: 100%;
  min-width: fit-content;
  padding: 8px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 12px;
    padding: 6px;
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 4px;
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
  display: flex;
  flex-direction: column;

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
  flex: 1;
  min-height: 200px;
  padding: 6px 0;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

export const DraggableItem = styled.div`
  /* O ref e props do drag são aplicados aqui pelo react-beautiful-dnd */
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex: 1;
`;

export const EmptyStateText = styled.p`
  color: #6b7280;
  margin: 0;
  font-size: 16px;
`;

export const ColumnHeader = styled.div<{ $isCollapsed?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  border-radius: 6px 6px 0 0;
  position: relative;
  min-height: 40px;
  flex-shrink: 0;
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
  display: ${(props) => (props.$isCollapsed ? 'none' : 'flex')};
  flex-direction: column;
  flex: 1;
  transition: all 0.3s ease-in-out;
  min-height: 0;
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

export const FooterContainer = styled.div`
  flex-shrink: 0;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #6c757d;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    font-size: 12px;
  }
`;

export const ResponsiveIndicator = styled.div`
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
