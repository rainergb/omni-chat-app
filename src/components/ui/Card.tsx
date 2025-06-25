import React, { ReactNode } from "react";
import styled from "styled-components";
import { useTheme } from "@/contexts/ThemeContext";

const StyledCard = styled.div<{
  $isDark: boolean;
  $hover?: boolean;
  $padding?: string;
  $borderRadius?: string;
}>`
  background: ${(props) => (props.$isDark ? "#1f2937" : "#ffffff")};
  border-radius: ${(props) => props.$borderRadius || "12px"};
  box-shadow: ${(props) =>
    props.$isDark
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"};
  border: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;

  ${(props) =>
    props.$hover &&
    `
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${
        props.$isDark
          ? "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)"
          : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      };
    }
  `}
`;

const CardHeader = styled.div<{ $isDark: boolean; $padding?: string }>`
  padding: ${(props) => props.$padding || "1rem 1.5rem"};
  border-bottom: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};

  @media (min-width: 640px) {
    padding: ${(props) => props.$padding || "1.5rem 2rem"};
  }
`;

const CardBody = styled.div<{ $padding?: string }>`
  padding: ${(props) => props.$padding || "1rem 1.5rem"};

  @media (min-width: 640px) {
    padding: ${(props) => props.$padding || "1.5rem 2rem"};
  }
`;

const CardFooter = styled.div<{ $isDark: boolean; $padding?: string }>`
  padding: ${(props) => props.$padding || "1rem 1.5rem"};
  border-top: 1px solid ${(props) => (props.$isDark ? "#374151" : "#e5e7eb")};
  background: ${(props) => (props.$isDark ? "#111827" : "#f9fafb")};

  @media (min-width: 640px) {
    padding: ${(props) => props.$padding || "1.5rem 2rem"};
  }
`;

const StatusIndicator = styled.div<{ $color: string; $height?: string }>`
  height: ${(props) => props.$height || "4px"};
  width: 100%;
  background: ${(props) => props.$color};
`;

interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  hover?: boolean;
  loading?: boolean;
  className?: string;
  padding?: string;
  headerPadding?: string;
  footerPadding?: string;
  borderRadius?: string;
  statusColor?: string;
  statusHeight?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  hover = false,
  loading = false,
  className = "",
  padding,
  headerPadding,
  footerPadding,
  borderRadius,
  statusColor,
  statusHeight,
  onClick,
  ...props
}) => {
  const { isDark } = useTheme();

  if (loading) {
    return (
      <StyledCard
        $isDark={isDark}
        $hover={hover}
        $padding={padding}
        $borderRadius={borderRadius}
        className={`animate-pulse ${className}`}
        onClick={onClick}
        {...props}
      >
        <div
          className={`h-4 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          } rounded w-3/4 mb-4`}
        ></div>
        <div
          className={`h-4 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          } rounded w-1/2 mb-2`}
        ></div>
        <div
          className={`h-4 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          } rounded w-full`}
        ></div>
      </StyledCard>
    );
  }

  return (
    <StyledCard
      $isDark={isDark}
      $hover={hover}
      $padding={padding}
      $borderRadius={borderRadius}
      className={className}
      onClick={onClick}
      {...props}
    >
      {statusColor && (
        <StatusIndicator $color={statusColor} $height={statusHeight} />
      )}

      {header && (
        <CardHeader $isDark={isDark} $padding={headerPadding}>
          {header}
        </CardHeader>
      )}

      <CardBody $padding={padding}>{children}</CardBody>

      {footer && (
        <CardFooter $isDark={isDark} $padding={footerPadding}>
          {footer}
        </CardFooter>
      )}
    </StyledCard>
  );
};
