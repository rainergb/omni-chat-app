import styled from 'styled-components';

export const CardContainer = styled.div`
  background-color: white;
  padding: 10px;
  margin-bottom: 6px;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const TaskTitle = styled.p`
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MoreIcon = styled.div`
  width: 16px;
  height: 16px;
  color: #737373;
  cursor: pointer;
  transition: color 0.2s ease;
  margin-right: 10px;

  &:hover {
    color: #404040;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const AvatarContainer = styled.div`
  .ant-avatar {
    background-color: #e5e5e5 !important;
    font-weight: 500 !important;
    color: #737373 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
`;

export const Separator = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #d4d4d4;
`;

interface DateTextProps {
  $color: string;
}

export const DateText = styled.span<DateTextProps>`
  color: ${(props) => props.$color};
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
