import React from "react";
import { Segmented as AntSegmented, SegmentedProps } from "antd";
import styled from "styled-components";
import { useTheme } from "@/contexts/ThemeContext";

const SegmentedWrapper = styled.div<{ $isDark: boolean }>`
  .ant-segmented {
    background: ${(props) => (props.$isDark ? "#374151" : "#f9fafb")};
    border-radius: 12px;
    height: 48px;
    padding: 4px;
    box-shadow: ${(props) => 
      props.$isDark 
        ? "0 4px 12px rgba(0, 0, 0, 0.3)"
        : "0 4px 12px rgba(0, 0, 0, 0.08)"
    };
    border: 1px solid ${(props) => (props.$isDark ? "#4b5563" : "#e5e7eb")};

    .ant-segmented-item {
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 20px;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.2s ease;      ${(props) =>
        props.$isDark
          ? `
        color: #d1d5db;
        
        &.ant-segmented-item-selected {
          height: 40px;
          background: linear-gradient(135deg, #00b9ae 0%, #1f2937 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px 0 rgba(0, 185, 174, 0.3);
          font-weight: 600;
          transform: translateY(0);
          transition: all 0.2s ease;
        }
        
        &.ant-segmented-item-selected:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #00a69b 0%, #0f172a 100%) !important;
          box-shadow: 0 6px 20px 0 rgba(0, 185, 174, 0.4) !important;
        }
        
        &:hover:not(.ant-segmented-item-selected) {
          background: #4b5563;
          color: #f3f4f6;
        }
      `
          : `
        color: #6b7280;
        
        &.ant-segmented-item-selected {
          height: 40px;
          background: linear-gradient(135deg, #00b9ae 0%, #1f2937 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px 0 rgba(0, 185, 174, 0.3);
          font-weight: 600;
          transform: translateY(0);
          transition: all 0.2s ease;
        }
        
        &.ant-segmented-item-selected:hover {
          transform: translateY(-1px);
          background: linear-gradient(135deg, #00a69b 0%, #0f172a 100%) !important;
          box-shadow: 0 6px 20px 0 rgba(0, 185, 174, 0.4) !important;
        }
        
        &:hover:not(.ant-segmented-item-selected) {
          background: #f3f4f6;
          color: #374151;
        }
      `}
      
      .ant-segmented-item-label {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      .anticon {
        font-size: 16px;
      }
    }
  }
`;

export const Segmented: React.FC<SegmentedProps> = (props) => {
  const { isDark } = useTheme();

  return (
    <SegmentedWrapper $isDark={isDark}>
      <AntSegmented {...props} />
    </SegmentedWrapper>
  );
};
