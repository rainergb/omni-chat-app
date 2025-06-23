// src/components/instances/Components/InstanceTable/InstanceTable.styles.ts
import styled from 'styled-components';
import { Button as AntButton } from 'antd';

interface StyledProps {
  $isDark?: boolean;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  margin-top: 1.5rem;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 112rem;
  margin: 0 auto;
`;

export const SkeletonCard = styled.div<StyledProps>`
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: ${({ $isDark }) => ($isDark ? "#1f2937" : "#ffffff")};
`;

export const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24rem;
`;

export const EmptyContent = styled.div`
  text-align: center;
`;

export const EmptyIconContainer = styled.div<StyledProps>`
  width: 6rem;
  height: 6rem;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $isDark }) => ($isDark ? "#1f2937" : "#f3f4f6")};
`;

export const EmptyTitle = styled.h3<StyledProps>`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ $isDark }) => ($isDark ? "#e5e7eb" : "#374151")};
`;

export const EmptyDescription = styled.p<StyledProps>`
  margin-bottom: 1.5rem;
  color: ${({ $isDark }) => ($isDark ? "#9ca3af" : "#6b7280")};
`;

export const CreateButton = styled(AntButton)`
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  border: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);

  &:hover {
    background: linear-gradient(to right, #2563eb, #7c3aed) !important;
  }

  &:focus {
    background: linear-gradient(to right, #2563eb, #7c3aed) !important;
  }
`;

export const ListViewContainer = styled.div<StyledProps>`
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  background-color: ${({ $isDark }) => ($isDark ? "#1f2937" : "#ffffff")};
`;

export const ListViewContent = styled.div`
  text-align: center;
  padding: 3rem 0;
`;

export const ListViewTitle = styled.h3<StyledProps>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ $isDark }) => ($isDark ? '#e5e7eb' : '#374151')};
`;

export const ListViewDescription = styled.p<StyledProps>`
  color: ${({ $isDark }) => ($isDark ? '#9ca3af' : '#6b7280')};
`;
