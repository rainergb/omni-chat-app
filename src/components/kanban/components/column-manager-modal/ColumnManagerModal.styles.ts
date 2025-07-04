import styled from 'styled-components';

export const ColorOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ColorCircle = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  border: 1px solid #d1d5db;
`;
