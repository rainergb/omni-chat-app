// src/components/ui/Segmented.tsx
import React from "react";
import { Segmented as AntSegmented, SegmentedProps } from "antd";
import styled from "styled-components";
import { useTheme } from "@/contexts/ThemeContext";

const SegmentedWrapper = styled.div<{ $isDark: boolean }>`
  .ant-segmented {
    background: ${(props) => (props.$isDark ? "#374151" : "#f9fafb")};
    border-radius: 8px;
    height: 40px;

    .ant-segmented-item {
      height: 40px;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      ${(props) =>
        props.$isDark
          ? `
        color: #d1d5db;
        
        &.ant-segmented-item-selected {
        height: 35px;
          background: #4b5563;
          color: #f9fafb;
        }
      `
          : ""}
      
      .ant-segmented-item-label {
        display: flex;
        align-items: center;
        gap: 4px;
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
