import styled from 'styled-components';

export const HeaderContainer = styled.div`
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Title = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 112px;
`;

export const TaskCountBadge = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background-color: #e5e5e5;
  font-size: 12px;
  color: #404040;
  font-weight: 500;
`;

export const AddButton = styled.div`
  width: 20px;
  height: 20px;

  .ant-btn {
    width: 20px !important;
    height: 20px !important;
    min-width: 20px !important;
    padding: 0 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  .anticon {
    width: 16px;
    height: 16px;
    color: #737373;
  }
`;
